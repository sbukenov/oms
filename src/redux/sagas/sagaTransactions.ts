import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import { ClientResponse } from 'sdkore';
import { SEARCH_DEBOUNCE } from '@bo/utils';

import { transactionsAccessor } from '~/utils/accessors';
import { mapFiltersForRequest, handleEntityParam } from '~/utils';
import { ordersAccessor } from '~/utils/accessors';
import { showErrorNotification, showSuccessNotification } from '~/utils/notification';
import type { OrderTransactions, GetAllTransactionsSuccessPayload, TransactionsParams } from '~/models';
import {
    getOrderTransactionsRequest,
    getOrderTransactionsSuccess,
    getOrderTransactionsFailure,
    loadTransactions,
    loadTransactionsNextPage,
    loadTransactionsPrevPage,
    getAllTransactionsRequest,
    getAllTransactionsSuccess,
    getAllTransactionsFailure,
    searchTransactions,
    updateTransactionFee,
    updateTransactionFeeSuccess,
    updateTransactionFeeFailure,
    addTransactionFee,
    addTransactionFeeFailure,
    addTransactionFeeSuccess,
    resetOrderTransactions,
} from '~/redux/slices';
import i18n from '~/utils/i18n';

import {
    getIsEntityIncludedTransactions,
    selectTransactionsHeaderNext,
    selectTransactionsHeaderPrev,
    selectTransactionsSearch,
    selectTransactionsFilter,
    getTransactionsFilterConfig,
} from '../selectors';

function* getOrderTransactions({ payload: orderId }: ReturnType<typeof getOrderTransactionsRequest>) {
    try {
        const { data }: ClientResponse<OrderTransactions> = yield call(() => ordersAccessor.getTransactions(orderId));
        yield put(getOrderTransactionsSuccess({ ...data, orderId }));
    } catch (error) {
        yield put(getOrderTransactionsFailure());
        yield call(showErrorNotification, error);
    }
}

function* getTransactionsList(params: Partial<TransactionsParams>, route?: string) {
    try {
        yield put(getAllTransactionsRequest());
        const transactions: GetAllTransactionsSuccessPayload = yield call(
            [transactionsAccessor, 'getTransactions'],
            params,
            route,
        );

        yield put(getAllTransactionsSuccess(transactions));
    } catch (error: any) {
        yield put(getAllTransactionsFailure());
        yield call(showErrorNotification, error);
    }
}

function* loadTransactionsSaga({ payload }: any) {
    const defaultFilterConfig: ReturnType<typeof getTransactionsFilterConfig> = yield select(
        getTransactionsFilterConfig,
    );
    const value: string = yield select(selectTransactionsSearch);
    const search = value || undefined;
    const filters: ReturnType<typeof selectTransactionsFilter> = yield select(selectTransactionsFilter);
    const isSelectedEntityIncluded: boolean = yield select(getIsEntityIncludedTransactions);
    const filterConfig = payload.filterTabConfig || defaultFilterConfig;

    const params: Record<string, any> = yield call(mapFiltersForRequest, filters, filterConfig);
    const queryParams = {
        search,
        ...params,
        ...handleEntityParam(isSelectedEntityIncluded, payload?.route),
    };

    yield* getTransactionsList(queryParams, payload?.route);
}

function* loadNextTransactionsPageSaga() {
    const next: ReturnType<typeof selectTransactionsHeaderNext> = yield select(selectTransactionsHeaderNext);
    if (!next) return;

    yield* getTransactionsList({}, next);
}

function* loadPrevTransactionsPageSaga() {
    const prev: ReturnType<typeof selectTransactionsHeaderPrev> = yield select(selectTransactionsHeaderPrev);
    if (!prev) return;

    yield* getTransactionsList({}, prev);
}

function* updateTransactionFeeSaga({ payload }: ReturnType<typeof updateTransactionFee>) {
    try {
        const { transactionId, feeId, onSuccess, values } = payload;

        yield call(() => transactionsAccessor.updateTransactionFee(transactionId, feeId, values));
        yield put(updateTransactionFeeSuccess());
        yield call(() =>
            showSuccessNotification({
                message: i18n.t('common.success'),
                description: i18n.t('notifications.fee_edited'),
            }),
        );
        yield call(onSuccess);
        yield put(resetOrderTransactions());
    } catch (error: any) {
        yield put(updateTransactionFeeFailure());
        yield call(showErrorNotification, error);
    }
}

function* addTransactionFeeSaga({ payload }: ReturnType<typeof addTransactionFee>) {
    try {
        const { transactionId, onSuccess, values } = payload;

        yield call(() => transactionsAccessor.addTransactionFee(transactionId, values));
        yield put(addTransactionFeeSuccess());
        yield call(() =>
            showSuccessNotification({
                message: i18n.t('common.success'),
                description: i18n.t('notifications.fee_created'),
            }),
        );

        yield call(onSuccess);
        yield put(resetOrderTransactions());
    } catch (error: any) {
        yield put(addTransactionFeeFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getOrderTransactionsRequest.type, getOrderTransactions);
    yield takeLatest(loadTransactions.type, loadTransactionsSaga);
    yield takeLatest(loadTransactionsNextPage.type, loadNextTransactionsPageSaga);
    yield takeLatest(loadTransactionsPrevPage.type, loadPrevTransactionsPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchTransactions.type, loadTransactionsSaga);
    yield takeLatest(updateTransactionFee.type, updateTransactionFeeSaga);
    yield takeLatest(addTransactionFee.type, addTransactionFeeSaga);
}
