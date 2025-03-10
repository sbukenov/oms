import type { ReplenishmentOperation } from '../InterfaceReplenishmentOperation';

export interface ReceptionsStore {
    orderReceptions: {
        loading: boolean;
        orderId: string | undefined;
        receptions: ReplenishmentOperation[];
    };
}
