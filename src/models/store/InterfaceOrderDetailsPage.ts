import type { Entity, BusinessUnit } from '@bo/utils';

import type { History } from '../InterfaceHistory';
import type { OrderFull } from '../InterfaceOrders';
import type { ReplenishmentOperation } from '../InterfaceReplenishmentOperation';
import type { Product } from '../InterfaceProducts';
import type { Items } from '../InterfaceNormalize';

export interface OrderDetailsPageStore {
    loading: boolean;
    data?: OrderFull;
    unexpectedItemsByUuid: Items<Product>;
    history: History;
    historyLoading: boolean;
    businessUnits: BusinessUnit[];
    supplierLoading: boolean;
    supplier: Entity | undefined;
    replenishmentOperations: ReplenishmentOperation[];
    replenishmentOperationsLoading: boolean;
    addingNewDelivery: boolean;
}
