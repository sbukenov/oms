import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type {
    OrdersPageStore,
    RootState,
    GetAllOrdersSuccessPayload,
    LoadPayload,
    OrderListRequestParams,
    SearchOrdersPayload,
} from '~/models';

import { defaultState } from '../store/initialStates';

type Orders = RootState['ordersPage'];

interface SliceOrdersReducer extends SliceCaseReducers<Orders> {
    getAllOrdersRequest: CaseReducer<Orders>;
    getAllOrdersSuccess: CaseReducer<Orders, PayloadAction<GetAllOrdersSuccessPayload>>;
    getAllOrdersFailure: CaseReducer<Orders>;
    loadOrders: CaseReducer<Orders, PayloadAction<LoadPayload>>;
    loadNextPage: CaseReducer<Orders>;
    loadPrevPage: CaseReducer<Orders>;
    updateSearch: CaseReducer<Orders, PayloadAction<LoadPayload & OrderListRequestParams>>;
    searchOrders: CaseReducer<Orders, PayloadAction<SearchOrdersPayload>>;
    updateFilters: CaseReducer<Orders, PayloadAction<OrdersPageStore['filters']>>;
    resetFilters: CaseReducer<Orders>;
    resetOrders: CaseReducer<Orders>;
}

export const sliceOrders = createSlice<Orders, SliceOrdersReducer>({
    initialState: defaultState.ordersPage,
    name: '@@orders',
    reducers: {
        /*** table ***/
        getAllOrdersRequest: (state) => {
            state.table.loading = true;
            state.table.next = state.table.prev = undefined;
            state.table.data = defaultState.ordersPage.table.data;
        },
        getAllOrdersSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            state.table.loading = false;
            state.table.data = payload.data;
            state.table.filters = payload.filters;
            state.table.next = next;
            state.table.prev = previous;
        },
        getAllOrdersFailure: (state) => {
            state.table.loading = false;
        },
        /*** search ***/
        updateSearch: (state, { payload }) => {
            payload.search !== undefined && (state.search = payload.search);
            state.route = payload?.route;
        },
        searchOrders: (state) => {
            state.table.loading = true;
        },
        loadOrders: (state, { payload }) => {
            state.route = payload?.route;
        },
        /*** filters ***/
        updateFilters: (state, { payload }) => {
            state.filters = payload;
        },
        resetFilters: (state) => {
            state.filters = defaultState.ordersPage.filters;
        },
        resetOrders: (state) => {
            state = defaultState.ordersPage;
        },
        /*** no state change ***/
        loadNextPage: () => {},
        loadPrevPage: () => {},
    },
});

export const ordersActions = sliceOrders.actions;

export const {
    getAllOrdersRequest,
    getAllOrdersSuccess,
    getAllOrdersFailure,
    loadOrders,
    loadNextPage,
    loadPrevPage,
    updateSearch,
    updateFilters,
    resetFilters,
    resetOrders,
    searchOrders,
} = ordersActions;
