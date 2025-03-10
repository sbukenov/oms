import { Entity, getSelectedEntity, MAIN_ENTITY_UUID, SEARCH_DEBOUNCE } from '@bo/utils';
import { call, takeLatest, put, select, all, debounce } from 'redux-saga/effects';

import type { GetSupplierConditionsResponse, Product, OrderSaveBody, Packaging } from '~/models';
import { ordersAccessor, packagingAccessor, replenishmentConditionsAccessor } from '~/utils/accessors';
import i18n from '~/utils/i18n';
import {
    mapDraftOrder,
    mapOrderLines,
    mapOrderLinesToProducts,
    mapPackagingToProduct,
    showErrorNotification,
    showSuccessNotification,
} from '~/utils';
import { ROUTE_ORDERS } from '~/const';

import {
    addProductKeys,
    addProducts,
    saveDraftOrder,
    getProductsFromOrderLines,
    getProductsFromOrderLinesSuccess,
    getProductsFromOrderLinesFailure,
    editOrder,
    editOrderSuccess,
    editOrderFailure,
    getSuppliers,
    getSuppliersSuccess,
    getSuppliersFailure,
    loadNextSuppliers,
    loadNextSuppliersSuccess,
    loadNextSuppliersFailure,
    getSupplierCondition,
    getSupplierConditionSuccess,
    getSupplierConditionFailure,
    searchSuppliers,
    prefillOrderInfo,
    prefillOrderInfoFailure,
    prefillOrderInfoSuccess,
    addProduct,
    setSupplier,
} from '../slices';
import {
    getOrderChanges,
    getSelectedProducts,
    selectNextSuppliers,
    selectProductsByKeys,
    selectSelectedSupplier,
} from '../selectors';
import { ClientResponse } from 'sdkore';

export function* addProductsSaga({ payload }: ReturnType<typeof addProductKeys>) {
    try {
        const products: Product[] = yield select(selectProductsByKeys(payload));
        yield put(addProducts(products));
    } catch (error: any) {
        yield call(showErrorNotification, error);
    }
}

export function* saveDraftOrderSaga({
    payload: { navigate, baseRoute, deliveryDate },
}: ReturnType<typeof saveDraftOrder>) {
    try {
        const entity: Entity | undefined = yield call(getSelectedEntity);
        const supplierUuid: string = yield select(selectSelectedSupplier);
        const products: Product[] = yield select(getSelectedProducts);
        const mappedOrder: OrderSaveBody = mapDraftOrder(supplierUuid, deliveryDate, products, entity);
        yield call([ordersAccessor, 'saveOrder'], mappedOrder);
        yield call(showSuccessNotification, {
            message: i18n.t('common.success'),
            description: i18n.t('notifications.order_created'),
        });
        yield call(() => navigate(`/${baseRoute}/${ROUTE_ORDERS}`));
    } catch (error: any) {
        yield call(showErrorNotification, error);
    }
}
export function* getProductsFromOrderLinesSaga({ payload }: ReturnType<typeof getProductsFromOrderLines>) {
    try {
        const response: Packaging[] = yield all(
            payload.map((line) => call([packagingAccessor, 'readOne'], line.packaging.id)),
        );
        yield put(getProductsFromOrderLinesSuccess(mapOrderLinesToProducts(response, payload)));
    } catch (error: any) {
        yield call(showErrorNotification, error);
        yield put(getProductsFromOrderLinesFailure());
    }
}

function* editOrderSaga({ payload: { orderId, onSuccess } }: ReturnType<typeof editOrder>) {
    try {
        const changes: ReturnType<typeof getOrderChanges> = yield select(getOrderChanges);
        const requests = [];

        if (changes.toDelete.length) {
            requests.push(call([ordersAccessor, 'deleteManyLines'], orderId, { order_lines: changes.toDelete }));
        }
        if (changes.toAdd.length) {
            requests.push(
                call([ordersAccessor, 'addManyLines'], orderId, { order_lines: mapOrderLines(changes.toAdd) }),
            );
        }
        if (changes.toEdit.length) {
            changes.toEdit.forEach(([id, product]) => {
                requests.push(call([ordersAccessor, 'editOrderLine'], orderId, id, product));
            });
        }
        yield all(requests);
        yield put(editOrderSuccess());
        yield call(onSuccess);
    } catch (error: any) {
        yield put(editOrderFailure());
        yield call(showErrorNotification, error);
    }
}

function* getSuppliersSaga({ payload }: ReturnType<typeof getSuppliers>) {
    try {
        const entity: Entity | null = yield call(getSelectedEntity);
        const {
            data: { replenishment_conditions },
            headers,
        }: ClientResponse<GetSupplierConditionsResponse> = yield call(
            [replenishmentConditionsAccessor, 'getReplenishmentConditions'],
            {
                business_unit: entity?.uuid || MAIN_ENTITY_UUID,
                search: payload,
            },
        );
        yield put(getSuppliersSuccess({ replenishment_conditions, next: headers.next }));
    } catch (error: any) {
        yield put(getSuppliersFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadNextSuppliersSaga() {
    try {
        const next: ReturnType<typeof selectNextSuppliers> = yield select(selectNextSuppliers);
        const {
            data: { replenishment_conditions },
            headers,
        }: ClientResponse<GetSupplierConditionsResponse> = yield call(
            [replenishmentConditionsAccessor, 'getReplenishmentConditions'],
            {},
            next,
        );
        yield put(loadNextSuppliersSuccess({ replenishment_conditions, next: headers.next }));
    } catch (error: any) {
        yield put(loadNextSuppliersFailure());
        yield call(showErrorNotification, error);
    }
}

function* getSupplierConditionSaga({ payload: { supplier, customer } }: ReturnType<typeof getSupplierCondition>) {
    try {
        const {
            data: { replenishment_conditions },
        }: ClientResponse<GetSupplierConditionsResponse> = yield call(
            [replenishmentConditionsAccessor, 'getReplenishmentConditions'],
            {
                supplier: [supplier],
                business_unit: customer,
            },
        );
        yield put(getSupplierConditionSuccess(replenishment_conditions[0]));
    } catch (error: any) {
        yield put(getSupplierConditionFailure());
        yield call(showErrorNotification, error);
    }
}

function* prefillOrderInfoSaga({ payload: searchParams }: ReturnType<typeof prefillOrderInfo>) {
    try {
        const entity: Entity | undefined = yield call(getSelectedEntity);
        const packagingId = searchParams.get('packaging');
        const supplierId = searchParams.get('supplier');

        if (packagingId) {
            const packaging: Packaging = yield call([packagingAccessor, 'readOne'], packagingId);
            yield put(addProduct(mapPackagingToProduct(packaging)));
        }
        if (supplierId) {
            yield put(getSupplierCondition({ supplier: supplierId, customer: entity?.uuid! }));
            yield put(setSupplier(supplierId));
        }
        yield put(prefillOrderInfoSuccess());
    } catch (error: any) {
        yield put(prefillOrderInfoFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(addProductKeys.type, addProductsSaga);
    yield takeLatest(saveDraftOrder.type, saveDraftOrderSaga);
    yield takeLatest(getProductsFromOrderLines.type, getProductsFromOrderLinesSaga);
    yield takeLatest(editOrder.type, editOrderSaga);
    yield takeLatest(getSuppliers.type, getSuppliersSaga);
    yield debounce(SEARCH_DEBOUNCE, searchSuppliers.type, getSuppliersSaga);
    yield takeLatest(loadNextSuppliers.type, loadNextSuppliersSaga);
    yield takeLatest(getSupplierCondition.type, getSupplierConditionSaga);
    yield takeLatest(prefillOrderInfo.type, prefillOrderInfoSaga);
}
