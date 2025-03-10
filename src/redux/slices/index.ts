import { loadOrders, sliceOrders } from './sliceOrders';
import { clearHistory, resetOrderDetails, sliceOrderDetails } from './sliceOrderDetails';
import { loadFulfillments, resetOrderFulfillments, sliceFulfillments } from './sliceFulfillments';
import { loadShipments, resetOrderShipments, sliceShipments } from './sliceShipments';
import { resetOrderReceptions, sliceReceptions } from './sliceReceptions';
import { resetOrderExpeditions, sliceExpeditions } from './sliceExpeditions';
import { loadReturns, resetOrderReturns, sliceReturns } from './sliceReturns';
import { loadTransactions, resetOrderTransactions, sliceTransactions } from './sliceTransactions';
import { sliceConfig } from './sliceConfig';
import { sliceStatuses } from './sliceStatuses';
import { sliceBusinessUnits } from './sliceBusinessUnits';
import { sliceTypes } from './sliceTypes';
import { sliceInitial } from './sliceInitial';
import { sliceOrderCreation } from './sliceOrderCreation';
import { sliceProducts } from './sliceProducts';
import { slicePackagings } from './slicePackagings';
import { sliceReceptionCreation } from './sliceReceptionCreation';
import { store } from '../store';

export * from './sliceInitial';
export * from './sliceOrders';
export * from './sliceOrderDetails';
export * from './sliceFulfillments';
export * from './sliceReceptions';
export * from './sliceExpeditions';
export * from './sliceShipments';
export * from './sliceReturns';
export * from './sliceTransactions';
export * from './sliceConfig';
export * from './sliceStatuses';
export * from './sliceBusinessUnits';
export * from './sliceTypes';
export * from './sliceOrderCreation';
export * from './sliceProducts';
export * from './slicePackagings';
export * from './sliceReceptionCreation';

export const rootReducer = {
    ordersPage: sliceOrders.reducer,
    orderDetails: sliceOrderDetails.reducer,
    fulfillments: sliceFulfillments.reducer,
    receptions: sliceReceptions.reducer,
    expeditions: sliceExpeditions.reducer,
    shipments: sliceShipments.reducer,
    returns: sliceReturns.reducer,
    transactions: sliceTransactions.reducer,
    config: sliceConfig.reducer,
    statuses: sliceStatuses.reducer,
    types: sliceTypes.reducer,
    businessUnits: sliceBusinessUnits.reducer,
    initial: sliceInitial.reducer,
    orderCreation: sliceOrderCreation.reducer,
    products: sliceProducts.reducer,
    packagings: slicePackagings.reducer,
    receptionCreation: sliceReceptionCreation.reducer,
};

export const refreshActionsMap = {
    orders: (args: any) => store.dispatch(loadOrders(args)),
    fulfillments: (args: any) => store.dispatch(loadFulfillments(args)),
    shipments: (args: any) => store.dispatch(loadShipments(args)),
    returns: (args: any) => store.dispatch(loadReturns(args)),
    transactions: (args: any) => store.dispatch(loadTransactions(args)),
    orderDetails: () => store.dispatch(resetOrderDetails()),
    history: () => store.dispatch(clearHistory()),
    orderFulfillments: () => store.dispatch(resetOrderFulfillments()),
    orderReceptions: () => store.dispatch(resetOrderReceptions()),
    orderExpeditions: () => store.dispatch(resetOrderExpeditions()),
    orderShipments: () => store.dispatch(resetOrderShipments()),
    orderReturns: () => store.dispatch(resetOrderReturns()),
    orderTransactions: () => store.dispatch(resetOrderTransactions()),
};
