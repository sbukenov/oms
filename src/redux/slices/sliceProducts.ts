import { createSlice, SliceCaseReducers, CaseReducer, PayloadAction } from '@reduxjs/toolkit';

import type { RootState, GetProductsSuccessPayload } from '~/models';
import { makeUniqueByUuid } from '~/utils';

import { defaultState } from '../store/initialStates';
import { mapProducts } from '../../utils';

type Products = RootState['products'];

interface SliceProductsReducer extends SliceCaseReducers<Products> {
    getProductsRequest: CaseReducer<Products>;
    getProductsSuccess: CaseReducer<Products, PayloadAction<GetProductsSuccessPayload>>;
    getProductsFailure: CaseReducer<Products>;
    loadProducts: CaseReducer<Products, PayloadAction<{ search?: string; supplier?: string } | undefined>>;
    searchProducts: CaseReducer<Products, PayloadAction<{ search?: string; supplier?: string }>>;
    resetProducts: CaseReducer<Products>;
    loadProductsNextPage: CaseReducer<Products>;
    loadProductsPrevPage: CaseReducer<Products>;
    setPackagingIsChosen: CaseReducer<Products, PayloadAction<{ productUuid: string; packagingId: string }>>;
}

export const sliceProducts = createSlice<Products, SliceProductsReducer>({
    initialState: defaultState.products,
    name: '@@products',
    reducers: {
        getProductsRequest: (state) => {
            state.loading = true;
        },
        getProductsSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            const products = mapProducts(payload.data.products);
            state.loading = false;
            state.products = products;
            state.allProductsByUuid = makeUniqueByUuid(products, state.allProductsByUuid);
            state.next = next;
            state.prev = previous;
        },
        getProductsFailure: (state) => {
            state.loading = false;
        },
        setPackagingIsChosen: (state, { payload: { packagingId, productUuid } }) => {
            const selectedProduct = state.allProductsByUuid[productUuid];
            const updatedProduct = {
                ...selectedProduct,
                packagings: selectedProduct.packagings.map((packaging) => ({
                    ...packaging,
                    isChosen: packaging.id === packagingId,
                })),
            };
            state.products = state.products.map((product) =>
                productUuid === product.product.pim_uuid ? updatedProduct : product,
            );
            state.allProductsByUuid[productUuid] = updatedProduct;
        },
        resetProducts: () => defaultState.products,
        loadProducts: () => {},
        searchProducts: () => {},
        loadProductsNextPage: () => {},
        loadProductsPrevPage: () => {},
    },
});

export const productsActions = sliceProducts.actions;

export const {
    loadProductsNextPage,
    loadProductsPrevPage,
    getProductsRequest,
    getProductsSuccess,
    getProductsFailure,
    loadProducts,
    resetProducts,
    searchProducts,
} = productsActions;
