import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import { ClientResponse } from 'sdkore';
import { SEARCH_DEBOUNCE } from '@bo/utils';

import i18n from '~/utils/i18n';
import { ordersAccessor, shipmentsAccessor } from '~/utils/accessors';
import { mapFiltersForRequest, handleEntityParam, showErrorNotification, showSuccessNotification } from '~/utils';
import type { OrderShipments, ShipmentsParams, GetAllShipmentsSuccessPayload } from '~/models';
import {
    getOrderShipmentsRequest,
    getOrderShipmentsSuccess,
    getOrderShipmentsFailure,
    deleteShipmentAttachment,
    deleteShipmentAttachmentSuccess,
    deleteShipmentAttachmentFailure,
    createShipment,
    createShipmentFailure,
    getAllShipmentsRequest,
    getAllShipmentsSuccess,
    getAllShipmentsFailure,
    loadShipments,
    loadShipmentsNextPage,
    loadShipmentsPrevPage,
    searchDeliveries,
    applyShipmentTransition,
    applyShipmentTransitionFailure,
    applyShipmentTransitionSuccess,
    resetOrderDetails,
    clearHistory,
    resetOrderShipments,
    createShipmentSuccess,
} from '~/redux/slices';

import {
    getIsEntityIncludedShipments,
    selectOrderDetailsId,
    selectShipmentsHeaderNext,
    selectShipmentsHeaderPrev,
    selectShipmentsSearch,
    selectShipmentsFilter,
    getDeliveriesFilterConfig,
} from '../selectors';

function* getOrderShipmentsSaga({ payload: orderId }: ReturnType<typeof getOrderShipmentsRequest>) {
    try {
        const { data }: ClientResponse<OrderShipments> = yield call(() => ordersAccessor.getShipments(orderId));
        yield put(getOrderShipmentsSuccess({ ...data, orderId }));
    } catch (error) {
        yield put(getOrderShipmentsFailure());
        yield call(showErrorNotification, error);
    }
}

function* deleteShipmentAttachmentSaga({ payload }: ReturnType<typeof deleteShipmentAttachment>) {
    try {
        const { id, attachmentId, onSuccess } = payload;
        const orderId: string = yield select(selectOrderDetailsId);
        yield call(() => shipmentsAccessor.deleteShipmentAttachment(id, attachmentId));
        yield put(deleteShipmentAttachmentSuccess());
        yield put(getOrderShipmentsRequest(orderId));
        yield call(onSuccess);
    } catch (error) {
        yield put(deleteShipmentAttachmentFailure());
        yield call(showErrorNotification, error);
    }
}

function* createShipmentSaga({ payload }: ReturnType<typeof createShipment>) {
    try {
        const { onSuccess, ...restPayload } = payload;
        const orderId: string = yield select(selectOrderDetailsId);
        yield call(() => ordersAccessor.createShipment(orderId, restPayload));
        yield call(showSuccessNotification, {
            message: i18n.t('common.success'),
            description: i18n.t('modals.shipment_creation.success_notification'),
        });
        yield call(onSuccess);
        yield put(createShipmentSuccess());
        yield put(resetOrderShipments());
        yield put(resetOrderDetails());
        yield put(clearHistory());
    } catch (error) {
        yield put(createShipmentFailure());
        yield call(showErrorNotification, error);
    }
}

function* getShipmentsList(params: Partial<ShipmentsParams>, route?: string) {
    try {
        yield put(getAllShipmentsRequest());
        const shipments: GetAllShipmentsSuccessPayload = yield call([shipmentsAccessor, 'getShipments'], params, route);

        yield put(getAllShipmentsSuccess(shipments));
    } catch (error: any) {
        yield put(getAllShipmentsFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadShipmentsSaga({ payload }: ReturnType<typeof loadShipments>) {
    const defaultFilterConfig: ReturnType<typeof getDeliveriesFilterConfig> = yield select(getDeliveriesFilterConfig);
    const value: string = yield select(selectShipmentsSearch);
    const search = value || undefined;
    const filters: ReturnType<typeof selectShipmentsFilter> = yield select(selectShipmentsFilter);
    const isSelectedEntityIncluded: boolean = yield select(getIsEntityIncludedShipments);
    const filterConfig = payload.filterTabConfig || defaultFilterConfig;

    const params: Record<string, any> = yield call(mapFiltersForRequest, filters, filterConfig);
    const queryParams = {
        search,
        ...params,
        ...handleEntityParam(isSelectedEntityIncluded, payload?.route),
    };

    yield* getShipmentsList(queryParams, payload?.route);
}

function* loadNextShipmentsPageSaga() {
    const next: ReturnType<typeof selectShipmentsHeaderNext> = yield select(selectShipmentsHeaderNext);
    if (!next) return;

    yield* getShipmentsList({}, next);
}

function* loadPrevShipmentsPageSaga() {
    const prev: ReturnType<typeof selectShipmentsHeaderPrev> = yield select(selectShipmentsHeaderPrev);
    if (!prev) return;

    yield* getShipmentsList({}, prev);
}

function* applyShipmentTransitionSaga({ payload }: ReturnType<typeof applyShipmentTransition>) {
    try {
        const { id, transition, pickup_code, onSuccess } = payload;
        yield call(() => shipmentsAccessor.applyTransition(id, { transition, pickup_code }));
        yield put(applyShipmentTransitionSuccess());
        yield call(() =>
            showSuccessNotification({
                message: i18n.t('common.success'),
                description: i18n.t('notifications.delivery_handed'),
            }),
        );
        yield call(onSuccess);
        yield put(resetOrderDetails());
        yield put(clearHistory());
        yield put(resetOrderShipments());
    } catch (error: any) {
        const { onError } = payload;
        yield call(onError);
        yield put(applyShipmentTransitionFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getOrderShipmentsRequest.type, getOrderShipmentsSaga);
    yield takeLatest(deleteShipmentAttachment.type, deleteShipmentAttachmentSaga);
    yield takeLatest(createShipment.type, createShipmentSaga);
    yield takeLatest(loadShipments.type, loadShipmentsSaga);
    yield takeLatest(loadShipmentsNextPage.type, loadNextShipmentsPageSaga);
    yield takeLatest(loadShipmentsPrevPage.type, loadPrevShipmentsPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchDeliveries.type, loadShipmentsSaga);
    yield takeLatest(applyShipmentTransition.type, applyShipmentTransitionSaga);
}
