import { createSelector } from '@reduxjs/toolkit';
import type { Product, RootState } from '~/models';
import { mapProductToLogisticUnit } from '~/utils';

export const selectReceptionDetails = (state: RootState) => state.receptionCreation.reception;

export const selectReceptionLoading = (state: RootState) => state.receptionCreation.loading;

export const selectReceptionProducts = (state: RootState) => state.receptionCreation.productsByUuid;

export const selectReceptionDataSource = createSelector(
    [selectReceptionDetails, selectReceptionProducts],
    (reception, products) => {
        if (!reception) {
            console.error('no reception in store');
            return;
        }
        const productsToAdd = Object.entries(products).reduce((acc: Product[], item) => {
            const [key, product] = item;
            const productAlreadyAdded = reception.logistic_units.find(({ logistic_unit_items, packaging }) => {
                return `${logistic_unit_items[0].pim_uuid}${packaging.id}` === key;
            });

            if (!productAlreadyAdded) {
                acc.push(product);
            }
            return acc;
        }, []);

        return [...reception.logistic_units, ...mapProductToLogisticUnit(productsToAdd)];
    },
);
