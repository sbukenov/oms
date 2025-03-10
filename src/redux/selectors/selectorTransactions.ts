import { createSelector } from '@reduxjs/toolkit';

import { countActiveFilters } from '~/utils';
import type { RootState } from '~/models';

export const selectOrderTransactions = (state: RootState) => state.transactions.orderTransactions;

export const selectTransactionsTable = (state: RootState) => state.transactions.table;
export const selectTransactionsSearch = (state: RootState) => state.transactions.table.search;
export const selectTransactionsFilter = (state: RootState) => state.transactions.table.filters;
export const selectTransactionsHeaderNext = (state: RootState) => state.transactions.table.headers.next;
export const selectTransactionsHeaderPrev = (state: RootState) => state.transactions.table.headers.prev;
export const selectIsApplyingAction = (state: RootState) => state.transactions.table.isApplyingAction;

export const countTransactionsAppliedFilters = createSelector(selectTransactionsFilter, countActiveFilters);
