import type { ReplenishmentOperation } from '../InterfaceReplenishmentOperation';

export interface ExpeditionsStore {
    orderExpeditions: {
        loading: boolean;
        orderId: string | undefined;
        expeditions: ReplenishmentOperation[];
    };
    isDeletingAttachment?: boolean;
}
