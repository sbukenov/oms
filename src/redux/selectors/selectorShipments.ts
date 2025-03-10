import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '~/models';
import { countActiveFilters } from '~/utils';

export const selectOrderShipments = (state: RootState) => state.shipments.orderShipments;

export const selectShipmentsTable = (state: RootState) => state.shipments.table;
export const selectShipmentsSearch = (state: RootState) => state.shipments.table.search;
export const selectShipmentsFilter = (state: RootState) => state.shipments.table.filters;
export const selectShipmentsHeaderNext = (state: RootState) => state.shipments.table.headers.next;
export const selectShipmentsHeaderPrev = (state: RootState) => state.shipments.table.headers.prev;

export const countShipmentsAppliedFilters = createSelector(selectShipmentsFilter, countActiveFilters);

export const selectCreatingShipment = (state: RootState) => state.shipments.isCreatingShipment;
