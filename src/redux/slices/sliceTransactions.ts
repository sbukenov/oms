import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type {
    RootState,
    OrderTransactions,
    GetAllTransactionsSuccessPayload,
    LoadPayload,
    TransactionsParams,
    UpdateFeePayload,
} from '~/models';

import { defaultState } from '../store/initialStates';

type Transactions = RootState['transactions'];

interface SliceTransactionsReducer extends SliceCaseReducers<Transactions> {
    getOrderTransactionsRequest: CaseReducer<Transactions, PayloadAction<string>>;
    getOrderTransactionsSuccess: CaseReducer<Transactions, PayloadAction<OrderTransactions & { orderId: string }>>;
    getOrderTransactionsFailure: CaseReducer<Transactions>;
    resetOrderTransactions: CaseReducer<Transactions>;
    resetTransactions: CaseReducer<Transactions>;
    getAllTransactionsRequest: CaseReducer<Transactions>;
    getAllTransactionsSuccess: CaseReducer<Transactions, PayloadAction<GetAllTransactionsSuccessPayload>>;
    getAllTransactionsFailure: CaseReducer<Transactions>;
    loadTransactions: CaseReducer<Transactions, PayloadAction<LoadPayload>>;
    loadTransactionsNextPage: CaseReducer<Transactions>;
    loadTransactionsPrevPage: CaseReducer<Transactions>;
    updateTransactionsFilters: CaseReducer<Transactions, PayloadAction<Transactions['table']['filters']>>;
    updateTransactionsSearch: CaseReducer<Transactions, PayloadAction<Partial<TransactionsParams>>>;
    searchTransactions: CaseReducer<Transactions>;
    updateTransactionFee: CaseReducer<
        Transactions,
        PayloadAction<{
            transactionId: string;
            feeId: string;
            values: UpdateFeePayload;
            onSuccess: () => void;
        }>
    >;
    updateTransactionFeeSuccess: CaseReducer<Transactions>;
    updateTransactionFeeFailure: CaseReducer<Transactions>;
    addTransactionFee: CaseReducer<
        Transactions,
        PayloadAction<{
            transactionId: string;
            values: UpdateFeePayload;
            onSuccess: () => void;
        }>
    >;
    addTransactionFeeSuccess: CaseReducer<Transactions>;
    addTransactionFeeFailure: CaseReducer<Transactions>;
}

export const sliceTransactions = createSlice<Transactions, SliceTransactionsReducer>({
    initialState: defaultState.transactions,
    name: '@@transactions',
    reducers: {
        /*** transactions to display on transaction tab  ***/
        getOrderTransactionsRequest: (state) => {
            state.orderTransactions.loading = true;
        },
        getOrderTransactionsSuccess: (state, { payload: { orderId, ...transactions } }) => {
            state.orderTransactions.transactions = transactions;
            state.orderTransactions.orderId = orderId;
            state.orderTransactions.loading = false;
        },
        getOrderTransactionsFailure: (state) => {
            state.orderTransactions.loading = false;
        },
        resetOrderTransactions: (state) => {
            state.orderTransactions = defaultState.transactions.orderTransactions;
        },
        /*** shipments table ***/
        getAllTransactionsRequest: (state) => {
            state.table.loading = true;
            state.table.headers.next = state.table.headers.prev = undefined;
            state.table.transactions = defaultState.transactions.table.transactions;
        },
        getAllTransactionsSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            state.table.loading = false;
            state.table.transactions = payload.data.transactions;
            state.table.headers.next = next;
            state.table.headers.prev = previous;
        },
        getAllTransactionsFailure: (state) => {
            state.table.loading = false;
        },
        updateTransactionsFilters: (state, { payload }) => {
            state.table.filters = payload;
        },
        updateTransactionsSearch: (state, { payload }) => {
            payload.search !== undefined && (state.table.search = payload.search);
        },
        searchTransactions: (state) => {
            state.table.loading = true;
        },
        updateTransactionFee: (state) => {
            state.table.isApplyingAction = true;
        },
        updateTransactionFeeSuccess: (state) => {
            state.table.isApplyingAction = false;
        },
        updateTransactionFeeFailure: (state) => {
            state.table.isApplyingAction = false;
        },
        addTransactionFee: (state) => {
            state.table.isApplyingAction = true;
        },
        addTransactionFeeSuccess: (state) => {
            state.table.isApplyingAction = false;
        },
        addTransactionFeeFailure: (state) => {
            state.table.isApplyingAction = false;
        },
        /*** common ***/
        resetTransactions: (state) => {
            state = defaultState.transactions;
        },
        loadTransactions: () => {},
        loadTransactionsNextPage: () => {},
        loadTransactionsPrevPage: () => {},
    },
});

export const transactionsActions = sliceTransactions.actions;

export const {
    getOrderTransactionsRequest,
    getOrderTransactionsSuccess,
    getOrderTransactionsFailure,
    resetOrderTransactions,
    resetTransactions,
    getAllTransactionsRequest,
    getAllTransactionsSuccess,
    getAllTransactionsFailure,
    loadTransactions,
    loadTransactionsNextPage,
    loadTransactionsPrevPage,
    updateTransactionsFilters,
    updateTransactionsSearch,
    searchTransactions,
    updateTransactionFee,
    updateTransactionFeeSuccess,
    updateTransactionFeeFailure,
    addTransactionFee,
    addTransactionFeeSuccess,
    addTransactionFeeFailure,
} = transactionsActions;
