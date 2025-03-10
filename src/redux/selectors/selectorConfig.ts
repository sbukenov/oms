import type { RootState } from '~/models';

export const getConfig = (state: RootState) => state.config;
export const getBaseRoute = (state: RootState) => state.config?.baseRoute;
export const getOrdersFilterConfig = (state: RootState) => state.config?.orders?.filters;
export const getPreparationFilterConfig = (state: RootState) => state.config?.preparations?.filters;
export const getDeliveriesFilterConfig = (state: RootState) => state.config?.deliveries?.filters;
export const getReturnsFilterConfig = (state: RootState) => state.config?.returns?.filters;
export const getTransactionsFilterConfig = (state: RootState) => state.config?.transactions?.filters;

export const getIsEntityIncludedOrders = (state: RootState) => !!state.config?.orders?.isSelectedEntityIncluded;
export const getIsEntityIncludedFulfillments = (state: RootState) =>
    !!state.config?.preparations?.isSelectedEntityIncluded;
export const getIsEntityIncludedShipments = (state: RootState) => !!state.config?.deliveries?.isSelectedEntityIncluded;
export const getIsEntityIncludedReturns = (state: RootState) => !!state.config?.returns?.isSelectedEntityIncluded;
export const getIsEntityIncludedTransactions = (state: RootState) =>
    !!state.config?.transactions?.isSelectedEntityIncluded;
