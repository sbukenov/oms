import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import { ClientResponse } from 'sdkore';
import { generatePath } from 'react-router-dom';
import { SEARCH_DEBOUNCE } from '@bo/utils';

import i18n from '~/utils/i18n';
import { ordersAccessor, returnsAccessor } from '~/utils/accessors';
import { mapFiltersForRequest, showErrorNotification, showSuccessNotification, handleEntityParam } from '~/utils';
import type { OrderReturn, ReturnReason, ReturnsResponseData, ReturnsParams, ReturnsStore } from '~/models';
import {
    getOrderReturnsRequest,
    getOrderReturnsSuccess,
    getOrderReturnsFailure,
    getReturnReasons,
    getReturnReasonsSuccess,
    getOrderDetailsRequest,
    createReturns,
    loadReturns,
    loadReturnsNextPage,
    loadReturnsPrevPage,
    getAllReturns,
    getAllReturnsSuccess,
    getAllReturnsFailure,
    searchReturns,
    clearHistory,
} from '~/redux/slices';
import { ROUTE_ID, ROUTE_ORDER, ROUTE_RETURN } from '~/const';

import {
    getBaseRoute,
    getIsEntityIncludedReturns,
    getReturnsFilterConfig,
    selectReturnsFilters,
    selectReturnsHeaderNext,
    selectReturnsHeaderPrev,
    selectReturnsSearch,
} from '../selectors';

function* getOrderReturns({ payload: orderId }: ReturnType<typeof getOrderReturnsRequest>) {
    try {
        const { data }: ClientResponse<OrderReturn[]> = yield call(() => ordersAccessor.getReturns(orderId));
        yield put(getOrderReturnsSuccess({ returns: data, orderId }));
    } catch (error) {
        yield put(getOrderReturnsFailure());
        yield call(showErrorNotification, error);
    }
}

function* getReturnReasonsSaga() {
    try {
        const { data }: ClientResponse<ReturnReason[]> = yield call(() => returnsAccessor.getReturnReasons());
        yield put(getReturnReasonsSuccess(data));
    } catch (error) {
        yield call(showErrorNotification, error);
    }
}

function* createReturnsSaga({ payload: { idOrder, body, navigate } }: ReturnType<typeof createReturns>) {
    const count = body.items.reduce((acc, item) => acc + item.quantity, 0);
    try {
        yield call(() => ordersAccessor.createReturns(idOrder, body));
        yield put(getOrderDetailsRequest(idOrder));
        yield put(getOrderReturnsRequest(idOrder));
        const baseRoute: string = yield select(getBaseRoute);
        yield call(() =>
            navigate(generatePath(`/${baseRoute}/${ROUTE_ORDER}/${ROUTE_ID}/${ROUTE_RETURN}`, { id: idOrder }), {
                replace: true,
            }),
        );
        yield call(showSuccessNotification, {
            message: i18n.t('notifications.return_created_successfully.message'),
            description: i18n.t('notifications.return_created_successfully.description', { count }),
        });
        yield put(clearHistory());
    } catch (error) {
        yield call(showErrorNotification, {
            message: i18n.t('notifications.return_created_with_error.message'),
            description: i18n.t('notifications.return_created_with_error.description', { count }),
        });
    }
}

function* getReturnsList(params: Partial<ReturnsParams>, route?: string) {
    try {
        yield put(getAllReturns());
        const {
            data: { filters, ...restData },
            headers,
        }: ClientResponse<ReturnsResponseData> = yield call([returnsAccessor, 'getReturns'], params, route);

        yield put(getAllReturnsSuccess({ data: restData, headers, filters }));
    } catch (error: any) {
        yield put(getAllReturnsFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadReturnsSaga({ payload }: ReturnType<typeof loadReturns>) {
    const defaultFilterConfig: ReturnType<typeof getReturnsFilterConfig> = yield select(getReturnsFilterConfig);
    const value: string = yield select(selectReturnsSearch);
    const search = value || undefined;
    const filters: ReturnsStore['table']['filters'] = yield select(selectReturnsFilters);
    const isSelectedEntityIncluded: boolean = yield select(getIsEntityIncludedReturns);
    const filterConfig = payload.filterTabConfig || defaultFilterConfig;

    const params: Record<string, any> = yield call(mapFiltersForRequest, filters, filterConfig);
    const queryParams = {
        search,
        ...params,
        ...handleEntityParam(isSelectedEntityIncluded, payload?.route),
    };
    yield* getReturnsList(queryParams, payload?.route);
}

function* loadNextReturnsPageSaga() {
    const next: ReturnType<typeof selectReturnsHeaderNext> = yield select(selectReturnsHeaderNext);
    if (!next) return;

    yield* getReturnsList({}, next);
}

function* loadPrevReturnsPageSaga() {
    const prev: ReturnType<typeof selectReturnsHeaderPrev> = yield select(selectReturnsHeaderPrev);
    if (!prev) return;

    yield* getReturnsList({}, prev);
}

export default function* watcher() {
    yield takeLatest(getOrderReturnsRequest.type, getOrderReturns);
    yield takeLatest(getReturnReasons.type, getReturnReasonsSaga);
    yield takeLatest(createReturns.type, createReturnsSaga);
    yield takeLatest(loadReturns.type, loadReturnsSaga);
    yield takeLatest(loadReturnsNextPage.type, loadNextReturnsPageSaga);
    yield takeLatest(loadReturnsPrevPage.type, loadPrevReturnsPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchReturns.type, loadReturnsSaga);
}
