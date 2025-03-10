import { call, put, select, takeLatest, debounce } from 'redux-saga/effects';
import type { ClientResponse } from 'sdkore';
import { SEARCH_DEBOUNCE } from '@bo/utils';

import type { OrderListRequestParams, OrdersResponseData, GetStatusesResponse } from '~/models';
import { mapFiltersForRequest } from '~/utils/mappers';
import { metaAccessor, ordersAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils/notification';
import { handleEntityParam } from '~/utils';

import {
    selectOrderSearch,
    selectOrdersFilters,
    selectOrdersListData,
    getIsEntityIncludedOrders,
    selectOrdersRoute,
    getOrdersFilterConfig,
} from '../selectors';
import {
    loadOrders,
    loadNextPage,
    loadPrevPage,
    searchOrders,
    getAllStatuses,
    getAllOrdersRequest,
    getAllOrdersSuccess,
    getAllOrdersFailure,
    getAllStatusesSuccess,
    getAllStatusesFailure,
} from '../slices';

function* getOrdersList(params: OrderListRequestParams, route = '') {
    try {
        yield put(getAllOrdersRequest());
        const {
            data: { filters, ...restData },
            headers,
        }: ClientResponse<OrdersResponseData> = yield call([ordersAccessor, 'getOrders'], params, route);
        yield put(getAllOrdersSuccess({ data: restData, headers, filters }));
    } catch (error: any) {
        yield put(getAllOrdersFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadOrdersSaga({ payload }: ReturnType<typeof loadOrders>) {
    const defaultFilterConfig: ReturnType<typeof getOrdersFilterConfig> = yield select(getOrdersFilterConfig);
    const value: ReturnType<typeof selectOrderSearch> = yield select(selectOrderSearch);
    const search = value || undefined;
    const filters: ReturnType<typeof selectOrdersFilters> = yield select(selectOrdersFilters);
    const route: ReturnType<typeof selectOrdersRoute> = yield select(selectOrdersRoute);
    const isSelectedEntityIncluded: boolean = yield select(getIsEntityIncludedOrders);
    const filterConfig = payload.filterTabConfig || defaultFilterConfig;

    const params: Record<string, any> = yield call(mapFiltersForRequest, filters, filterConfig);
    const queryParams = {
        search,
        ...params,
        ...handleEntityParam(isSelectedEntityIncluded, route),
    };

    yield* getOrdersList(queryParams, route);
}

function* loadNextOrdersPageSaga() {
    const { next }: ReturnType<typeof selectOrdersListData> = yield select(selectOrdersListData);
    if (!next) return;

    yield* getOrdersList({}, next);
}

function* loadPrevOrdersPageSaga() {
    const { prev }: ReturnType<typeof selectOrdersListData> = yield select(selectOrdersListData);
    if (!prev) return;

    yield* getOrdersList({}, prev);
}

export function* getAllStatusesSaga() {
    try {
        const statuses: GetStatusesResponse = yield call(() => metaAccessor.getStatuses());
        yield put(getAllStatusesSuccess(statuses));
    } catch (error: any) {
        yield put(getAllStatusesFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(loadOrders.type, loadOrdersSaga);
    yield takeLatest(loadNextPage.type, loadNextOrdersPageSaga);
    yield takeLatest(loadPrevPage.type, loadPrevOrdersPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchOrders.type, loadOrdersSaga);
    yield takeLatest(getAllStatuses.type, getAllStatusesSaga);
}
