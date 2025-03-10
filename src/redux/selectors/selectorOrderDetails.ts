import { createSelector } from '@reduxjs/toolkit';

import type { RootState, Items, OrderLinesToReturn } from '~/models';
import { isValidToReturn } from '../../utils';
import { UNEXPECTED_TYPE } from '~/const';

export const selectOrderDetails = (state: RootState) => state.orderDetails;

export const getSupplier = (state: RootState) => state.orderDetails.supplier;
export const getOwnerId = (state: RootState) => state.orderDetails.data?.owner?.id;
export const getSupplierLoading = (state: RootState) => state.orderDetails.supplierLoading;

export const selectOrderDetailsData = (state: RootState) => state.orderDetails.data;

export const selectLoadingOrder = (state: RootState) => state.orderDetails.loading;

export const selectOrderLines = (state: RootState) => state.orderDetails.data?.order_lines;
export const selectUnexpectedItems = (state: RootState) => Object.values(state.orderDetails.unexpectedItemsByUuid);
export const selectMappedUnexpectedItems = createSelector(selectUnexpectedItems, (products) =>
    products.map((product) => ({
        ...product,
        ...product.packagings[0],
        type: UNEXPECTED_TYPE,
        quantity: 1,
        label: product.packagings[0].label,
        packaging: {
            id: product.packagings[0].id,
            product_per_packaging: product.packagings[0].product_per_packaging,
            label: product.packagings[0].reference,
            product: product.product,
        },
        unit_price_including_vat: product.packagings[0].price?.amount,
    })),
);
export const selectOrderLinesWithUnexpected = createSelector(
    selectOrderLines,
    selectMappedUnexpectedItems,
    (lines, unexpectedItems) => (lines ? [...lines, ...unexpectedItems] : unexpectedItems),
);
export const selectOrderComments = (state: RootState) => state.orderDetails.data?.comments;

export const selectOrderDetailsId = (state: RootState) => state.orderDetails.data?.id;

export const selectHistoryOrderId = (state: RootState) => state.orderDetails.history.object?.id;
export const selectHistoryOrderEvents = (state: RootState) => state.orderDetails.history.object_events;
export const selectHistoryPagination = (state: RootState) => state.orderDetails.history.pagination;

export const selectOrderBusinessUnits = (state: RootState) => state.orderDetails.businessUnits;

export const selectOrderLinesForReturn = createSelector(
    selectOrderLines,
    (orderLines) =>
        orderLines?.reduce<Items<OrderLinesToReturn>>((acc, orderLine) => {
            if (!isValidToReturn(orderLine)) {
                return acc;
            }
            const quantityLeft = orderLine.delivery_items_quantities.left_for_return;

            if (!quantityLeft) return acc;

            return {
                ...acc,
                [orderLine.id]: {
                    quantityLeft,
                    id: orderLine.id,
                    reference: orderLine.reference,
                    label: orderLine.label,
                    reason_type: undefined,
                    reason: undefined,
                    maxQuantityLeft: quantityLeft,
                    quantityToReturn: 0,
                },
            };
        }, {}) || {},
);

export const selectIsAddingNewDelivery = (state: RootState) => state.orderDetails.addingNewDelivery;
