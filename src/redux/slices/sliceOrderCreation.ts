import React from 'react';
import { NavigateFunction } from 'react-router';
import { Dayjs } from 'dayjs';
import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { RootState, SupplierConditions, Product, Packaging, OrderLine } from '~/models';
import { mapProductsByUuidId, getPricesAndAmounts, getUuidIdProduct } from '~/utils';

import { defaultState } from '../store/initialStates';

type OrderCreation = RootState['orderCreation'];

interface SliceOrderCreationReducer extends SliceCaseReducers<OrderCreation> {
    getSupplierCondition: CaseReducer<OrderCreation, PayloadAction<{ supplier: string; customer: string }>>;
    getSupplierConditionSuccess: CaseReducer<OrderCreation, PayloadAction<SupplierConditions>>;
    getSupplierConditionFailure: CaseReducer<OrderCreation>;
    getSuppliers: CaseReducer<OrderCreation, PayloadAction<string | undefined>>;
    searchSuppliers: CaseReducer<OrderCreation, PayloadAction<string | undefined>>;
    getSuppliersSuccess: CaseReducer<
        OrderCreation,
        PayloadAction<{ replenishment_conditions: SupplierConditions[]; next?: string }>
    >;
    getSuppliersFailure: CaseReducer<OrderCreation>;
    loadNextSuppliers: CaseReducer<OrderCreation>;
    loadNextSuppliersSuccess: CaseReducer<
        OrderCreation,
        PayloadAction<{ replenishment_conditions: SupplierConditions[]; next?: string }>
    >;
    loadNextSuppliersFailure: CaseReducer<OrderCreation>;
    setSupplierConditions: CaseReducer<OrderCreation, PayloadAction<SupplierConditions>>;
    setSupplier: CaseReducer<OrderCreation, PayloadAction<string | undefined>>;
    clearSupplier: CaseReducer<OrderCreation>;
    addProducts: CaseReducer<OrderCreation, PayloadAction<Product[]>>;
    addProduct: CaseReducer<OrderCreation, PayloadAction<Product>>;
    getProductsFromOrderLines: CaseReducer<OrderCreation, PayloadAction<OrderLine[]>>;
    getProductsFromOrderLinesSuccess: CaseReducer<OrderCreation, PayloadAction<any>>;
    getProductsFromOrderLinesFailure: CaseReducer<OrderCreation>;
    deleteProduct: CaseReducer<OrderCreation, PayloadAction<string>>;
    addProductKeys: CaseReducer<OrderCreation, PayloadAction<React.Key[]>>;
    changeProductQuantity: CaseReducer<
        OrderCreation,
        PayloadAction<{
            uuid: string;
            quantity: number;
            price?: Packaging['price'];
        }>
    >;
    clearSelectedProducts: CaseReducer<OrderCreation>;
    saveDraftOrder: CaseReducer<
        OrderCreation,
        PayloadAction<{ navigate: NavigateFunction; baseRoute: string; deliveryDate: Dayjs }>
    >;
    editOrder: CaseReducer<OrderCreation, PayloadAction<{ orderId: string; onSuccess: () => void }>>;
    editOrderSuccess: CaseReducer<OrderCreation>;
    editOrderFailure: CaseReducer<OrderCreation>;
    prefillOrderInfo: CaseReducer<OrderCreation, PayloadAction<URLSearchParams>>;
    prefillOrderInfoSuccess: CaseReducer<OrderCreation>;
    prefillOrderInfoFailure: CaseReducer<OrderCreation>;
}

export const sliceOrderCreation = createSlice<OrderCreation, SliceOrderCreationReducer>({
    initialState: defaultState.orderCreation,
    name: '@@orderCreation',
    reducers: {
        getSupplierCondition: (state) => {
            state.supplierConditionsLoading = true;
        },
        getSupplierConditionSuccess: (state, { payload }) => {
            state.supplierConditions = payload;
            state.supplierConditionsLoading = false;
        },
        getSupplierConditionFailure: (state) => {
            state.supplierConditionsLoading = false;
        },
        searchSuppliers: (state) => {
            state.isSuppliersLoading = true;
        },
        getSuppliers: (state) => {
            state.isSuppliersLoading = true;
        },
        getSuppliersSuccess: (state, { payload }) => {
            state.isSuppliersLoading = false;
            state.suppliers = payload.replenishment_conditions;
            state.nextSuppliers = payload.next;
        },
        getSuppliersFailure: (state) => {
            state.isSuppliersLoading = false;
        },
        loadNextSuppliers: (state) => {
            state.isSuppliersLoading = true;
        },
        loadNextSuppliersSuccess: (state, { payload }) => {
            state.isSuppliersLoading = false;
            state.suppliers = [...state.suppliers, ...payload.replenishment_conditions];
            state.nextSuppliers = payload.next;
        },
        loadNextSuppliersFailure: (state) => {
            state.isSuppliersLoading = false;
        },
        setSupplier: (state, { payload }) => {
            state.supplier = payload;
        },
        clearSupplier: (state) => {
            state.supplier = undefined;
            state.supplierConditions = undefined;
            state.productsByUuid = {};
        },
        deleteProduct: (state, { payload: uuidToRemove }) => {
            const { [uuidToRemove]: productToRemove, ...restOfProducts } = state.productsByUuid;
            state.productsByUuid = restOfProducts;
        },
        changeProductQuantity: (state, { payload: { uuid, quantity, price } }) => {
            state.productsByUuid[uuid] = {
                ...state.productsByUuid[uuid],
                ...getPricesAndAmounts(quantity, price),
            };
        },
        addProducts: (state, { payload }) => {
            state.productsByUuid = mapProductsByUuidId(payload, state.productsByUuid);
        },
        addProduct: (state, { payload }) => {
            const key = getUuidIdProduct(payload);
            if (state.productsByUuid[key]) return state;
            state.productsByUuid[key] = payload;
        },
        getProductsFromOrderLines: () => {},
        getProductsFromOrderLinesSuccess: (state, { payload }) => {
            state.productsByUuid = {
                ...state.productsByUuid,
                ...payload,
            };
        },
        getProductsFromOrderLinesFailure: () => {},
        clearSelectedProducts: (state) => {
            state.productsByUuid = {};
        },
        addProductKeys: () => {},
        saveDraftOrder: () => {},
        editOrder: (state) => {
            state.isUpdating = true;
        },
        editOrderSuccess: (state) => {
            state.isUpdating = false;
        },
        editOrderFailure: (state) => {
            state.isUpdating = false;
        },
        setSupplierConditions: (state, { payload }) => {
            state.supplierConditions = payload;
        },
        prefillOrderInfo: () => {},
        prefillOrderInfoSuccess: () => {},
        prefillOrderInfoFailure: () => {},
    },
});

export const orderCreationActions = sliceOrderCreation.actions;

export const {
    addProduct,
    addProductKeys,
    addProducts,
    deleteProduct,
    changeProductQuantity,
    clearSelectedProducts,
    saveDraftOrder,
    getProductsFromOrderLines,
    getProductsFromOrderLinesFailure,
    getProductsFromOrderLinesSuccess,
    editOrder,
    editOrderSuccess,
    editOrderFailure,
    searchSuppliers,
    setSupplier,
    getSuppliers,
    getSuppliersSuccess,
    getSuppliersFailure,
    setSupplierConditions,
    loadNextSuppliers,
    loadNextSuppliersSuccess,
    loadNextSuppliersFailure,
    getSupplierCondition,
    getSupplierConditionSuccess,
    getSupplierConditionFailure,
    prefillOrderInfo,
    prefillOrderInfoSuccess,
    prefillOrderInfoFailure,
} = orderCreationActions;
