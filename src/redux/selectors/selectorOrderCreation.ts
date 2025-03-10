import { createSelector } from '@reduxjs/toolkit';
import { getRawAmountValue } from 'utils';

import type { EditLineData, Product, RootState } from '~/models';
import { getReplenishmentTotals } from '~/utils';

import { selectOrderLines } from './selectorOrderDetails';

export const selectSupplierConditions = (state: RootState) => state.orderCreation.supplierConditions;
export const selectSupplierConditionsLoading = (state: RootState) => state.orderCreation.supplierConditionsLoading;
export const selectSuppliersLoading = (state: RootState) => state.orderCreation.isSuppliersLoading;
export const selectSelectedSupplier = (state: RootState) => state.orderCreation.supplier;
export const getProductsByUuid = (state: RootState) => state.orderCreation.productsByUuid;

export const getSelectedProducts = createSelector(getProductsByUuid, (productsById) => Object.values(productsById));

export const orderLinesChanged = createSelector(getProductsByUuid, selectOrderLines, (products, orderLines) => {
    if (!products || !Object.keys(products).length || !orderLines) return false;
    if (Object.keys(products).length !== orderLines.length) return true;

    for (let line of orderLines) {
        const key = line.packaging.product.pim_uuid + line.packaging.id;
        if (!products[key]) return true;
        if (products[key]?.quantity !== line.quantity) {
            return true;
        }
    }

    return false;
});

export const getOrderChanges = createSelector(getProductsByUuid, selectOrderLines, (products, orderLines) => {
    const productsDraft = { ...products };
    const toAdd: Product[] = [];
    const toDelete: string[] = [];
    const toEdit: [string, EditLineData][] = [];

    orderLines?.forEach((line) => {
        const key = line.packaging.product.pim_uuid + line.packaging.id;
        if (!products[key]) {
            toDelete.push(line.id);
            return;
        }

        if (products[key].quantity !== line.quantity) {
            toEdit.push([
                line.id,
                {
                    label: line.label,
                    owner: line.owner.id,
                    packaging: line.packaging.id,
                    reference: line.reference!,
                    vat_rate: products[key].selectedPackaging!.price?.vat_rate || line.vat_rate,
                    quantity: products[key].quantity || 0,
                    amount_excluding_vat: products[key].amount_excluding_vat!,
                    amount_including_vat: products[key].amount_including_vat!,
                    unit_price_excluding_vat: products[key].unit_price_excluding_vat!,
                    unit_price_including_vat: products[key].unit_price_including_vat!,
                    vat_amount: products[key].vat_amount!,
                },
            ]);
        }
        delete productsDraft[key];
    });

    if (Object.keys(productsDraft).length) {
        toAdd.push(...Object.values(productsDraft));
    }

    return {
        toAdd,
        toDelete,
        toEdit,
    };
});

export const isOrderUpdating = (state: RootState) => state.orderCreation.isUpdating;
export const selectSuppliers = (state: RootState) => state.orderCreation.suppliers;
export const selectNextSuppliers = (state: RootState) => state.orderCreation.nextSuppliers;

export const selectOrderTotals = createSelector(getProductsByUuid, (products) => {
    return getReplenishmentTotals(Object.values(products));
});

export const selectSupplierMinAmount = (state: RootState) => {
    if (!state.orderCreation.supplierConditions?.min_amount) return 0;

    return getRawAmountValue(state.orderCreation.supplierConditions.min_amount);
};
