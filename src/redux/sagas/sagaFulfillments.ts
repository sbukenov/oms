import { call, put, takeLatest, select, debounce } from 'redux-saga/effects';
import { ClientResponse } from 'sdkore';
import { generatePath } from 'react-router-dom';
import { SEARCH_DEBOUNCE } from '@bo/utils';

import {
    handleEntityParam,
    mapFulfillmentItemsToTransit,
    mapFulfillmentItemsToComplete,
    mapFiltersForRequest,
    showErrorNotification,
} from '~/utils';
import { ordersAccessor, fulfillmentsAccessor } from '~/utils/accessors';
import type {
    OrderFulfillmentDetailed,
    FulfillmentItem,
    Fulfillment,
    FulfillmentsParams,
    FulfillmentsResponseData,
    FulfillmentsStore,
} from '~/models';
import { Transition } from '~/models';
import i18n from '~/utils/i18n';
import { ROUTE_PREPARE, ROUTE_ID, ROUTE_ORDER, ROUTE_PREPARATION, ROUTE_FULFILLMENTS } from '~/const';
import {
    getOrderFulfillmentDetailedRequest,
    prepareFulfillment,
    getOrderFulfillmentDetailedSuccess,
    getOrderFulfillmentDetailedFailure,
    getFulfillmentDetails,
    getFulfillmentDetailsSuccess,
    getFulfillmentDetailsFailure,
    confirmPreparation,
    resetFulfillments,
    getAllFulfillments,
    getAllFulfillmentsSuccess,
    getAllFulfillmentsFailure,
    loadFulfillments,
    loadFulfillmentsNextPage,
    loadFulfillmentsPrevPage,
    searchFulfillments,
    resetOrderDetails,
    clearHistory,
    resetOrderFulfillments,
} from '~/redux/slices';

import {
    selectFulfillmentItemsToProcessById,
    selectFulfillmentItemsProcessing,
    selectFulfillmentsOrderId,
    selectFulfillmentsSearch,
    getIsEntityIncludedFulfillments,
    selectFulfillmentsHeaderNext,
    selectFulfillmentsHeaderPrev,
    selectFulfillmentsFilters,
    getBaseRoute,
    getPreparationFilterConfig,
} from '../selectors';

function* getOrderFulfillmentDetailed({ payload: orderId }: ReturnType<typeof getOrderFulfillmentDetailedRequest>) {
    try {
        const { data }: ClientResponse<OrderFulfillmentDetailed> = yield call(() =>
            ordersAccessor.getFulfilmentDetailed(orderId),
        );
        yield put(getOrderFulfillmentDetailedSuccess(data));
    } catch (error: any) {
        yield put(getOrderFulfillmentDetailedFailure());
        yield call(showErrorNotification, error);
    }
}

function* prepareFulfillmentSaga({
    payload: { fulfillmentId, navigate, state },
}: ReturnType<typeof prepareFulfillment>) {
    try {
        const fulfillmentItems: FulfillmentItem[] = yield select(selectFulfillmentItemsToProcessById(fulfillmentId));

        if (!!fulfillmentItems.length) {
            yield call(() =>
                fulfillmentsAccessor.transitFulfillmentItems(fulfillmentId, {
                    fulfillment_items: mapFulfillmentItemsToTransit(fulfillmentItems, Transition.process),
                }),
            );
        }
        const baseRoute: string = yield select(getBaseRoute);
        yield call(() =>
            navigate(generatePath(`/${baseRoute}/${ROUTE_FULFILLMENTS}/${ROUTE_PREPARE}`, { id: fulfillmentId }), {
                state,
                replace: true,
            }),
        );
    } catch (error) {
        yield call(showErrorNotification, { message: i18n.t('notifications.something_bad_happened') });
    }
}

function* getFulfillmentDetailsSaga({ payload: fulfillmentId }: ReturnType<typeof getFulfillmentDetails>) {
    try {
        const response: ClientResponse<Fulfillment> = yield call(() =>
            fulfillmentsAccessor.getOneDetailedFulfillment(fulfillmentId),
        );
        yield put(getFulfillmentDetailsSuccess(response.data));
    } catch (error: any) {
        yield put(getFulfillmentDetailsFailure());
        yield call(showErrorNotification, error);
    }
}

function* confirmPreparationSaga({
    payload: { fulfillmentId, navigate, state },
}: ReturnType<typeof confirmPreparation>) {
    try {
        const fulfillmentItems: FulfillmentItem[] = yield select(selectFulfillmentItemsProcessing);

        yield call(() =>
            fulfillmentsAccessor.completeFulfillment(fulfillmentId, mapFulfillmentItemsToComplete(fulfillmentItems)),
        );

        yield call(() =>
            fulfillmentsAccessor.transitFulfillmentItems(fulfillmentId, {
                fulfillment_items: mapFulfillmentItemsToTransit(fulfillmentItems, Transition.complete),
            }),
        );

        const orderId: string = yield select(selectFulfillmentsOrderId);
        const baseRoute: string = yield select(getBaseRoute);
        yield put(resetFulfillments());
        yield call(() =>
            navigate(generatePath(`/${baseRoute}/${ROUTE_ORDER}/${ROUTE_ID}/${ROUTE_PREPARATION}`, { id: orderId }), {
                state,
                replace: true,
            }),
        );
        yield put(resetOrderDetails());
        yield put(clearHistory());
        yield put(resetOrderFulfillments());
    } catch (error) {
        yield call(showErrorNotification, { message: i18n.t('notifications.something_bad_happened') });
    }
}

function* getFulfillmentsList(params: Partial<FulfillmentsParams>, route?: string) {
    try {
        yield put(getAllFulfillments());
        const { data, headers }: ClientResponse<FulfillmentsResponseData> = yield call(
            [fulfillmentsAccessor, 'getFulfillments'],
            params,
            route,
        );

        yield put(getAllFulfillmentsSuccess({ data, headers }));
    } catch (error: any) {
        yield put(getAllFulfillmentsFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadFulfillmentsSaga({ payload }: ReturnType<typeof loadFulfillments>) {
    const defaultFilterConfig: ReturnType<typeof getPreparationFilterConfig> = yield select(getPreparationFilterConfig);
    const value: string = yield select(selectFulfillmentsSearch);
    const search = value || undefined;
    const filters: FulfillmentsStore['table']['filters'] = yield select(selectFulfillmentsFilters);
    const isSelectedEntityIncluded: boolean = yield select(getIsEntityIncludedFulfillments);
    const filterConfig = payload.filterTabConfig || defaultFilterConfig;

    const params: Record<string, any> = yield call(mapFiltersForRequest, filters, filterConfig);
    const queryParams = {
        search,
        ...params,
        ...handleEntityParam(isSelectedEntityIncluded, payload?.route),
    };

    yield* getFulfillmentsList(queryParams, payload?.route);
}

function* loadNextFulfillmentsPageSaga() {
    const next: ReturnType<typeof selectFulfillmentsHeaderNext> = yield select(selectFulfillmentsHeaderNext);
    if (!next) return;

    yield* getFulfillmentsList({}, next);
}

function* loadPrevFulfillmentsPageSaga() {
    const prev: ReturnType<typeof selectFulfillmentsHeaderPrev> = yield select(selectFulfillmentsHeaderPrev);
    if (!prev) return;

    yield* getFulfillmentsList({}, prev);
}

export default function* watcher() {
    yield takeLatest(getOrderFulfillmentDetailedRequest.type, getOrderFulfillmentDetailed);
    yield takeLatest(prepareFulfillment.type, prepareFulfillmentSaga);
    yield takeLatest(getFulfillmentDetails.type, getFulfillmentDetailsSaga);
    yield takeLatest(confirmPreparation.type, confirmPreparationSaga);
    yield takeLatest(loadFulfillments.type, loadFulfillmentsSaga);
    yield takeLatest(loadFulfillmentsNextPage.type, loadNextFulfillmentsPageSaga);
    yield takeLatest(loadFulfillmentsPrevPage.type, loadPrevFulfillmentsPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchFulfillments.type, loadFulfillmentsSaga);
}
