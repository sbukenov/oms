import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { Entity, showSuccessNotification, GetBusinessUnitsResponse } from '@bo/utils';

import { ROUTE_EXPEDITION } from '~/const';
import type { OrderDetailsPageStore, OrderFull, History, ReplenishmentOperations, Product } from '~/models';
import { ordersAccessor, entityAccessor, historyAccessor, stockOperationAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils/notification';
import { mapLogisticUnitsData, stripEmptyValues } from '~/utils';
import i18n from '~/utils/i18n';

import {
    selectHistoryOrderId,
    selectHistoryPagination,
    selectOrderDetails,
    selectOrderDetailsId,
    selectProductsByKeys,
} from '../selectors';
import {
    getOrderDetailsRequest,
    addComment,
    editComment,
    deleteComment,
    getOrderDetailsSuccess,
    getOrderDetailsFailure,
    addCommentSuccess,
    addCommentFailure,
    deleteCommentSuccess,
    deleteCommentFailure,
    editCommentSuccess,
    editCommentFailure,
    getOrderHistory,
    getOrderHistorySuccess,
    getOrderHistoryFailure,
    editShippingAddress,
    editShippingAddressSuccess,
    editShippingAddressFailure,
    loadNextOrderHistory,
    addNextOrderHistory,
    getOrderBusinessUnits,
    getOrderBusinessUnitsSuccess,
    getOrderBusinessUnitsFailure,
    resetOrderDetails,
    clearHistory,
    getSupplierRequest,
    getSupplierSuccess,
    getSupplierFailure,
    addNewDelivery,
    addNewDeliverySuccess,
    addNewDeliveryFailure,
    resetOrderExpeditions,
    addUnexpectedProductKeys,
    addUnexpectedProducts,
} from '../slices';

function* getOrderDetailsSaga({ payload }: ReturnType<typeof getOrderDetailsRequest>) {
    try {
        const data: OrderFull = yield call([ordersAccessor, 'readOne'], payload);
        yield put(getOrderDetailsSuccess(data));
    } catch (error: any) {
        yield put(getOrderDetailsFailure());
        yield call(showErrorNotification, error);
    }
}

function* addCommentSaga({ payload }: ReturnType<typeof addComment>) {
    try {
        const currentOrder: OrderDetailsPageStore = yield select(selectOrderDetails);
        const id = currentOrder.data?.id;
        const { title, content, onSuccess, recipient, sender } = payload;

        if (!id) {
            throw new Error('Id must be present');
        }

        yield call(() =>
            ordersAccessor.addComment(id, {
                title,
                content,
                recipient,
                sender,
            }),
        );
        yield put(addCommentSuccess());
        yield call(onSuccess);
        yield put(getOrderDetailsRequest(id));
    } catch (error: any) {
        yield put(addCommentFailure());
        yield call(() => showErrorNotification(error));
    }
}

function* editCommentSaga({ payload }: ReturnType<typeof editComment>) {
    try {
        const currentOrder: OrderDetailsPageStore = yield select(selectOrderDetails);
        const id = currentOrder.data?.id;
        const { commentId, title, content, onSuccess } = payload;

        if (!id) {
            throw new Error('Id must be present');
        }

        yield call(() => ordersAccessor.editComment(id, commentId, { title, content: content || undefined }));
        yield put(editCommentSuccess());
        yield call(onSuccess);
        yield put(getOrderDetailsRequest(id));
    } catch (error: any) {
        yield put(editCommentFailure());
        yield call(() => showErrorNotification(error));
    }
}

function* deleteCommentSaga({ payload }: ReturnType<typeof deleteComment>) {
    try {
        const currentOrder: OrderDetailsPageStore = yield select(selectOrderDetails);
        const id = currentOrder.data?.id;
        const commentId = payload;

        if (!id) {
            throw new Error('Id must be present');
        }

        yield call(() => ordersAccessor.deleteComment(id, commentId));
        yield put(deleteCommentSuccess());
        yield put(getOrderDetailsRequest(id));
    } catch (error: any) {
        yield put(deleteCommentFailure());
        yield call(() => showErrorNotification(error));
    }
}

function* getOrderHistorySaga({ payload: orderId }: ReturnType<typeof getOrderHistory>) {
    try {
        const history: History = yield call([historyAccessor, 'getListByType'], 'order', orderId, {});
        yield put(getOrderHistorySuccess(history));
    } catch (error: any) {
        if (error.originalError?.response?.data?.status !== 403) {
            yield call(() => showErrorNotification(error));
        }
        yield put(getOrderHistoryFailure());
    }
}

function* loadNextOrderHistorySaga() {
    try {
        const orderId: string | undefined = yield select(selectHistoryOrderId);
        const pagination: History['pagination'] = yield select(selectHistoryPagination);
        if (!orderId || !pagination) return;

        const params = {
            page: pagination.page + 1,
        };
        const history: History = yield call([historyAccessor, 'getListByType'], 'order', orderId, params);
        yield put(addNextOrderHistory(history));
    } catch (error: any) {
        yield put(getOrderHistoryFailure());
        yield call(() => showErrorNotification(error));
    }
}

function* refreshHistory() {
    const id: string | undefined = yield select(selectOrderDetailsId);
    if (!id) {
        throw new Error('Id must be present');
    }
    yield put(getOrderHistory(id));
}

function* editShippingAddressSaga({ payload }: ReturnType<typeof editShippingAddress>) {
    try {
        const { orderId, values, onSuccess } = payload;
        yield call(() => ordersAccessor.editShippingAddress(orderId, stripEmptyValues(values)));
        yield put(editShippingAddressSuccess());
        yield call(onSuccess);
        yield put(resetOrderDetails());
        yield put(clearHistory());
    } catch (error: any) {
        yield put(editShippingAddressFailure());
        const originalError = error.originalError?.response?.data;
        if (originalError.invalid_params) {
            const status = originalError.status;
            const description = originalError.title || error.description || '';

            const errors = originalError.invalid_params.map((invalidParam: { error: string; field: string }) => {
                return call(showErrorNotification, {
                    message: i18n.t('common.error'),
                    description: status ? i18n.t(`errors.${invalidParam.field}.${status}`) : description,
                });
            });
            yield all(errors);
            return;
        }
        yield call(() => showErrorNotification(error));
    }
}

export function* getOrderBusinessUnitsSaga({ payload: orderId }: ReturnType<typeof getOrderBusinessUnits>) {
    try {
        const response: GetBusinessUnitsResponse = yield call(() => ordersAccessor.getBusinessUnits(orderId));

        yield put(getOrderBusinessUnitsSuccess(response.business_units));
    } catch (error: any) {
        yield put(getOrderBusinessUnitsFailure());
        yield call(showErrorNotification, error);
    }
}

export function* getSupplierSaga({ payload: supplierUuid }: ReturnType<typeof getSupplierRequest>) {
    try {
        const entity: Entity = yield call([entityAccessor, 'readOne'], supplierUuid);

        yield put(getSupplierSuccess(entity));
    } catch (error: any) {
        yield put(getSupplierFailure());
        yield call(showErrorNotification, error);
    }
}

function* addNewDeliverySaga({ payload }: ReturnType<typeof addNewDelivery>) {
    try {
        const orderId: ReturnType<typeof selectOrderDetailsId> = yield select(selectOrderDetailsId);

        if (!orderId) {
            throw new Error('No order id');
        }

        const { addAndReceive, reference, selectedProductsById, onSuccess } = payload;
        yield call([stockOperationAccessor, 'createReplenishmentOperation'], {
            type: 'expedition',
            reference,
            order_id: orderId,
        });
        const { replenishment_operations }: ReplenishmentOperations = yield call(() =>
            stockOperationAccessor.getReplenishmentOperation(orderId, { type: ['expedition'] }),
        );
        yield call(
            [stockOperationAccessor, 'createManyLogisticUnits'],
            mapLogisticUnitsData(replenishment_operations[0]?.id, selectedProductsById),
        );
        yield call(onSuccess, addAndReceive ? replenishment_operations[0]?.id : ROUTE_EXPEDITION);
        yield put(addNewDeliverySuccess());
        yield put(resetOrderExpeditions());
        yield call(showSuccessNotification, {
            message: i18n.t('common.success'),
            description: i18n.t('notifications.expedition_created'),
        });
    } catch (error: any) {
        yield put(addNewDeliveryFailure());
        yield call(showErrorNotification, error);
    }
}

function* addUnexpectedProductsSaga({ payload }: ReturnType<typeof addUnexpectedProductKeys>) {
    try {
        const products: Product[] = yield select(selectProductsByKeys(payload));
        yield put(addUnexpectedProducts(products));
    } catch (error: any) {
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getOrderDetailsRequest.type, getOrderDetailsSaga);
    yield takeLatest(addComment.type, addCommentSaga);
    yield takeLatest(editComment.type, editCommentSaga);
    yield takeLatest(deleteComment.type, deleteCommentSaga);
    yield takeLatest(getOrderHistory.type, getOrderHistorySaga);
    yield takeLatest(loadNextOrderHistory.type, loadNextOrderHistorySaga);
    yield takeLatest([addCommentSuccess.type, editCommentSuccess.type, deleteCommentSuccess.type], refreshHistory);
    yield takeLatest(editShippingAddress.type, editShippingAddressSaga);
    yield takeLatest(getOrderBusinessUnits.type, getOrderBusinessUnitsSaga);
    yield takeLatest(getSupplierRequest.type, getSupplierSaga);
    yield takeLatest(addNewDelivery.type, addNewDeliverySaga);
    yield takeLatest(addUnexpectedProductKeys.type, addUnexpectedProductsSaga);
}
