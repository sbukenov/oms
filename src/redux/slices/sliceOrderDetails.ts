import React from 'react';
import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';
import type { Entity, BusinessUnit } from '@bo/utils';

import type {
    OrderFull,
    RootState,
    AddCommentPayload,
    EditCommentPayload,
    History,
    ShippingAddressFormData,
    OrderLinesQuantitiesById,
    Product,
} from '~/models';

import { defaultState } from '../store/initialStates';
import { mapProductsByUuidId } from '~/utils';

type OrderDetails = RootState['orderDetails'];

interface SliceOrderDetailsReducer extends SliceCaseReducers<OrderDetails> {
    getOrderDetailsRequest: CaseReducer<OrderDetails, PayloadAction<string>>;
    getOrderDetailsSuccess: CaseReducer<OrderDetails, PayloadAction<OrderFull>>;
    getOrderDetailsFailure: CaseReducer<OrderDetails>;
    resetOrderDetails: CaseReducer<OrderDetails>;
    addComment: CaseReducer<OrderDetails, PayloadAction<AddCommentPayload>>;
    addCommentSuccess: CaseReducer<OrderDetails>;
    addCommentFailure: CaseReducer<OrderDetails>;
    editComment: CaseReducer<OrderDetails, PayloadAction<EditCommentPayload>>;
    editCommentSuccess: CaseReducer<OrderDetails>;
    editCommentFailure: CaseReducer<OrderDetails>;
    deleteComment: CaseReducer<OrderDetails, PayloadAction<string>>;
    deleteCommentSuccess: CaseReducer<OrderDetails>;
    deleteCommentFailure: CaseReducer<OrderDetails>;
    getOrderHistory: CaseReducer<OrderDetails, PayloadAction<string>>;
    getOrderHistorySuccess: CaseReducer<OrderDetails, PayloadAction<History>>;
    addNextOrderHistory: CaseReducer<OrderDetails, PayloadAction<History>>;
    getOrderHistoryFailure: CaseReducer<OrderDetails>;
    clearHistory: CaseReducer<OrderDetails>;
    editShippingAddress: CaseReducer<
        OrderDetails,
        PayloadAction<{ values: ShippingAddressFormData; onSuccess: () => void; orderId: string }>
    >;
    editShippingAddressSuccess: CaseReducer<OrderDetails>;
    editShippingAddressFailure: CaseReducer<OrderDetails>;
    loadNextOrderHistory: CaseReducer<OrderDetails>;
    getOrderBusinessUnits: CaseReducer<OrderDetails, PayloadAction<string>>;
    getOrderBusinessUnitsSuccess: CaseReducer<OrderDetails, PayloadAction<BusinessUnit[]>>;
    getOrderBusinessUnitsFailure: CaseReducer<OrderDetails>;
    deleteUnexpectedProducts: CaseReducer<OrderDetails, PayloadAction<string>>;
    getSupplierRequest: CaseReducer<OrderDetails, PayloadAction<string>>;
    getSupplierSuccess: CaseReducer<OrderDetails, PayloadAction<Entity>>;
    getSupplierFailure: CaseReducer<OrderDetails>;
    addNewDelivery: CaseReducer<
        OrderDetails,
        PayloadAction<{
            addAndReceive: boolean;
            reference: string;
            selectedProductsById: OrderLinesQuantitiesById;
            onSuccess: (route: string) => void;
        }>
    >;
    addNewDeliverySuccess: CaseReducer<OrderDetails>;
    addNewDeliveryFailure: CaseReducer<OrderDetails>;
    addUnexpectedProductKeys: CaseReducer<OrderDetails, PayloadAction<React.Key[]>>;
    addUnexpectedProducts: CaseReducer<OrderDetails, PayloadAction<Product[]>>;
    resetUnexpectedProducts: CaseReducer<OrderDetails>;
}

export const sliceOrderDetails = createSlice<OrderDetails, SliceOrderDetailsReducer>({
    initialState: defaultState.orderDetails,
    name: '@@orderDetails',
    reducers: {
        getOrderDetailsRequest: (state) => {
            state.loading = true;
        },
        getOrderDetailsSuccess: (state, { payload }) => {
            state.loading = false;
            state.data = payload;
        },
        getOrderDetailsFailure: (state) => {
            state.loading = false;
        },
        addUnexpectedProducts: (state, { payload }) => {
            state.unexpectedItemsByUuid = mapProductsByUuidId(payload, state.unexpectedItemsByUuid, true);
        },
        deleteUnexpectedProducts: (state, { payload: uuidToRemove }) => {
            const { [uuidToRemove]: productToRemove, ...restOfProducts } = state.unexpectedItemsByUuid;
            state.unexpectedItemsByUuid = restOfProducts;
        },
        resetUnexpectedProducts: (state) => {
            state.unexpectedItemsByUuid = defaultState.orderDetails.unexpectedItemsByUuid;
        },
        /*** common ***/
        resetOrderDetails: () => defaultState.orderDetails,
        /*** no state change ***/
        addComment: () => {},
        addCommentSuccess: () => {},
        addCommentFailure: () => {},
        editComment: () => {},
        editCommentSuccess: () => {},
        editCommentFailure: () => {},
        deleteComment: () => {},
        deleteCommentSuccess: () => {},
        deleteCommentFailure: () => {},
        loadNextOrderHistory: () => {},
        addUnexpectedProductKeys: () => {},
        /*** history ***/
        getOrderHistory: (state) => {
            state.historyLoading = true;
        },
        getOrderHistorySuccess: (state, { payload }) => {
            state.history = payload;
            state.historyLoading = false;
        },
        addNextOrderHistory: (state, { payload }) => {
            state.history.object_events = [...state.history.object_events, ...payload.object_events];
            state.history.pagination = payload.pagination;
        },
        getOrderHistoryFailure: (state) => {
            state.historyLoading = false;
        },
        clearHistory: (state) => {
            state.history = defaultState.orderDetails.history;
        },
        /*** shipping address  ***/
        editShippingAddress: (state) => {
            state.loading = true;
        },
        editShippingAddressSuccess: (state) => {
            state.loading = false;
        },
        editShippingAddressFailure: (state) => {
            state.loading = false;
        },
        /*** business units for order ***/
        getOrderBusinessUnits: () => {},
        getOrderBusinessUnitsSuccess: (state, { payload }) => {
            state.businessUnits = payload;
        },
        getOrderBusinessUnitsFailure: () => {},
        /*** supplier info ***/
        getSupplierRequest: (state) => {
            state.supplierLoading = true;
        },
        getSupplierSuccess: (state, { payload }) => {
            state.supplier = payload;
            state.supplierLoading = false;
        },
        getSupplierFailure: (state) => {
            state.supplierLoading = false;
        },
        addNewDelivery: (state) => {
            state.addingNewDelivery = true;
        },
        addNewDeliverySuccess: (state) => {
            state.addingNewDelivery = false;
        },
        addNewDeliveryFailure: (state) => {
            state.addingNewDelivery = false;
        },
    },
});

export const orderDetailsActions = sliceOrderDetails.actions;

export const {
    getOrderDetailsRequest,
    getOrderDetailsSuccess,
    getOrderDetailsFailure,
    resetOrderDetails,
    addComment,
    addCommentSuccess,
    addCommentFailure,
    editComment,
    editCommentSuccess,
    editCommentFailure,
    deleteComment,
    deleteCommentSuccess,
    deleteCommentFailure,
    getOrderHistory,
    getOrderHistorySuccess,
    getOrderHistoryFailure,
    editShippingAddress,
    editShippingAddressSuccess,
    editShippingAddressFailure,
    clearHistory,
    loadNextOrderHistory,
    addNextOrderHistory,
    getOrderBusinessUnits,
    getOrderBusinessUnitsSuccess,
    getOrderBusinessUnitsFailure,
    getSupplierRequest,
    getSupplierSuccess,
    getSupplierFailure,
    addNewDelivery,
    addNewDeliverySuccess,
    addNewDeliveryFailure,
    addUnexpectedProductKeys,
    addUnexpectedProducts,
    deleteUnexpectedProducts,
    resetUnexpectedProducts,
} = orderDetailsActions;
