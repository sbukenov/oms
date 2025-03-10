import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '~/models';
import { countActiveFilters } from '~/utils';

export const selectOrderReturns = (state: RootState) => state.returns.orderReturns;

export const selectReturnReasons = (state: RootState) => state.returns.reasons;

export const selectActiveReturnReasons = createSelector(selectReturnReasons, (returnReason) =>
    returnReason.filter((reason) => !reason.deactivation_date),
);

export const selectReturnsTable = (state: RootState) => state.returns.table;
export const selectReturnsSearch = (state: RootState) => state.returns.table.search;
export const selectReturnsFilters = (state: RootState) => state.returns.table.filters;
export const selectReturnsHeaderNext = (state: RootState) => state.returns.table.headers.next;
export const selectReturnsHeaderPrev = (state: RootState) => state.returns.table.headers.prev;

export const countReturnsAppliedFilters = createSelector(selectReturnsFilters, countActiveFilters);
