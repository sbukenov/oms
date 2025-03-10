import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type {
    OrderReturns,
    RootState,
    ReturnReason,
    CreateReturnAction,
    GetAllReturnsSuccessPayload,
    OrderListRequestParams,
    LoadPayload,
} from '~/models';

import { defaultState } from '../store/initialStates';

type Returns = RootState['returns'];

interface SliceReturnsReducer extends SliceCaseReducers<Returns> {
    getOrderReturnsRequest: CaseReducer<Returns, PayloadAction<string>>;
    getOrderReturnsSuccess: CaseReducer<Returns, PayloadAction<OrderReturns>>;
    getOrderReturnsFailure: CaseReducer<Returns>;
    resetOrderReturns: CaseReducer<Returns>;
    resetReturns: CaseReducer<Returns>;
    getReturnReasons: CaseReducer<Returns>;
    getReturnReasonsSuccess: CaseReducer<Returns, PayloadAction<ReturnReason[]>>;
    createReturns: CaseReducer<Returns, PayloadAction<CreateReturnAction>>;
    getAllReturns: CaseReducer<Returns>;
    getAllReturnsSuccess: CaseReducer<Returns, PayloadAction<GetAllReturnsSuccessPayload>>;
    getAllReturnsFailure: CaseReducer<Returns>;
    loadReturns: CaseReducer<Returns, PayloadAction<LoadPayload>>;
    loadReturnsNextPage: CaseReducer<Returns>;
    loadReturnsPrevPage: CaseReducer<Returns>;
    updateReturnFilters: CaseReducer<Returns, PayloadAction<Returns['table']['filters']>>;
    updateReturnsSearch: CaseReducer<Returns, PayloadAction<LoadPayload & OrderListRequestParams>>;
    searchReturns: CaseReducer<Returns>;
}

export const sliceReturns = createSlice<Returns, SliceReturnsReducer>({
    initialState: defaultState.returns,
    name: '@@returns',
    reducers: {
        /*** returns to display on return tab ***/
        getOrderReturnsRequest: (state) => {
            state.orderReturns.loading = true;
        },
        getOrderReturnsSuccess: (state, { payload }) => {
            state.orderReturns.returns = payload.returns;
            state.orderReturns.orderId = payload.orderId;
            state.orderReturns.loading = false;
        },
        getOrderReturnsFailure: (state) => {
            state.orderReturns.loading = false;
        },
        resetOrderReturns: (state) => {
            state.orderReturns = defaultState.returns.orderReturns;
        },
        /*** return reasons ***/
        getReturnReasonsSuccess: (state, { payload }) => {
            state.reasons = payload;
        },
        /*** returns table ***/
        getAllReturns: (state) => {
            state.table.loading = true;
            state.table.headers.next = state.table.headers.prev = undefined;
            state.table.returns = defaultState.returns.table.returns;
        },
        getAllReturnsSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            state.table.loading = false;
            state.table.returns = payload.data.returns;
            state.table.headers.next = next;
            state.table.headers.prev = previous;
        },
        getAllReturnsFailure: (state) => {
            state.table.loading = false;
        },
        updateReturnFilters: (state, { payload }) => {
            state.table.filters = payload;
        },
        updateReturnsSearch: (state, { payload }) => {
            payload.search !== undefined && (state.table.search = payload.search);
            state.table.route = payload?.route;
        },
        searchReturns: (state) => {
            state.table.loading = true;
        },
        loadReturns: (state, { payload }) => {
            state.table.route = payload?.route;
        },
        /*** common ***/
        resetReturns: (state) => {
            state = defaultState.returns;
        },
        /*** no state change ***/
        getReturnReasons: () => {},
        createReturns: () => {},
        loadReturnsNextPage: () => {},
        loadReturnsPrevPage: () => {},
    },
});

export const returnsActions = sliceReturns.actions;

export const {
    getOrderReturnsRequest,
    getOrderReturnsSuccess,
    getOrderReturnsFailure,
    resetReturns,
    getReturnReasons,
    getReturnReasonsSuccess,
    createReturns,
    getAllReturns,
    getAllReturnsSuccess,
    getAllReturnsFailure,
    loadReturns,
    loadReturnsNextPage,
    loadReturnsPrevPage,
    updateReturnFilters,
    updateReturnsSearch,
    resetOrderReturns,
    searchReturns,
} = returnsActions;
