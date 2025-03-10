import { createSelector } from '@reduxjs/toolkit';

import type { RootState, FulfillmentItem } from '~/models';
import { FulfillmentItemStatusCodes } from '~/models';
import { countActiveFilters } from '~/utils';

export const selectOrderFulfillmentDetailed = (state: RootState) => state.fulfillments.orderFulfillmentDetailed;

export const selectFulfillmentItemsToProcessById = (fulfillmentId: string) => (state: RootState) =>
    (
        state.fulfillments.orderFulfillmentDetailed.data?.fulfillments?.find(
            (fulfillment) => fulfillment.id === fulfillmentId,
        )?.fulfillment_items || []
    ).filter(
        (fulfillmentItem: FulfillmentItem) => fulfillmentItem.completion === FulfillmentItemStatusCodes.TO_PROCESS,
    );

export const selectFulfillmentPreparation = (state: RootState) => state.fulfillments.fulfillmentPreparation;

export const selectFulfillmentItemsProcessing = (state: RootState) =>
    state.fulfillments.fulfillmentPreparation.data?.fulfillment_items?.filter(
        (fulfillmentItem: FulfillmentItem) => fulfillmentItem.completion === FulfillmentItemStatusCodes.PROCESSING,
    );

export const selectFulfillmentsOrderId = (state: RootState) =>
    state.fulfillments.fulfillmentPreparation.data?.order?.id;

export const selectFulfillmentsTable = (state: RootState) => state.fulfillments.table;
export const selectFulfillmentsSearch = (state: RootState) => state.fulfillments.table.search;
export const selectFulfillmentsFilters = (state: RootState) => state.fulfillments.table.filters;
export const selectFulfillmentsHeaderNext = (state: RootState) => state.fulfillments.table.headers.next;
export const selectFulfillmentsHeaderPrev = (state: RootState) => state.fulfillments.table.headers.prev;

export const countFulfillmentsAppliedFilters = createSelector(selectFulfillmentsFilters, countActiveFilters);
