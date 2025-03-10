import { store } from '~/redux/store';
import type { BusinessUnit } from '@bo/utils';

import type { OrdersPageStore } from './InterfaceOrdersPage';
import type { OrderDetailsPageStore } from './InterfaceOrderDetailsPage';
import type { FulfillmentsStore } from './InterfaceFulfillments';
import type { ShipmentsStore } from './InterfaceShipments';
import type { ReceptionsStore } from './InterfaceReceptions';
import type { ExpeditionsStore } from './InterfaceExpeditions';
import type { ReturnsStore } from './InterfaceReturns';
import type { TransactionsStore } from './InterfaceTransactions';
import type { ModuleConfigFull } from '../InterfaceModuleConfig';
import type { GetStatusesResponse } from './InterfaceOrdersPage';
import type { Types } from '../InterfaceTypes';
import type { OrderCreationStore } from './InterfaceOrderCreation';
import type { ProductsStore } from './InterfaceProducts';
import type { PackagingsStore } from './InterfacePackagings';
import type { ReceptionCreationStore } from './InterfaceReceptionCreation';

export interface InitialStore {
    isInitialized: boolean;
}

export type RootState = {
    ordersPage: OrdersPageStore;
    orderDetails: OrderDetailsPageStore;
    fulfillments: FulfillmentsStore;
    shipments: ShipmentsStore;
    receptions: ReceptionsStore;
    expeditions: ExpeditionsStore;
    returns: ReturnsStore;
    transactions: TransactionsStore;
    config: ModuleConfigFull;
    statuses: GetStatusesResponse | null;
    types: Types | null;
    businessUnits: BusinessUnit[];
    initial: InitialStore;
    orderCreation: OrderCreationStore;
    products: ProductsStore;
    packagings: PackagingsStore;
    receptionCreation: ReceptionCreationStore;
};

export type AppDispatch = typeof store.dispatch;
