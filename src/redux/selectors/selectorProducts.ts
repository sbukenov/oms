import type { RootState } from '~/models';
import React from 'react';

export const selectProducts = (state: RootState) => state.products;

export const selectProductList = (state: RootState) => state.products.products;

export const selectProductsHeaderNext = (state: RootState) => state.products.next;

export const selectProductsHeaderPrev = (state: RootState) => state.products.prev;

export const selectProductsByKeys = (keys: React.Key[]) => (state: RootState) =>
    Object.values(state.products.allProductsByUuid).filter((product) => keys.includes(product.product.pim_uuid));
