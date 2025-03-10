import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '~/models';
import { countActiveFilters } from '~/utils/helpers';

export const selectOrdersListData = (state: RootState) => state.ordersPage.table;

export const selectOrderSearch = (state: RootState) => state.ordersPage.search;

export const selectOrdersFilters = (state: RootState) => state.ordersPage.filters;

export const selectOrdersRoute = (state: RootState) => state.ordersPage.route;

export const countAppliedFilters = createSelector(selectOrdersFilters, countActiveFilters);
