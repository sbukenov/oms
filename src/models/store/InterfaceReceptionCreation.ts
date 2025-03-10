import type { Items } from '../InterfaceNormalize';
import type { Product } from '../InterfaceProducts';
import type { LogisticUnit, ReplenishmentOperation } from '../InterfaceReplenishmentOperation';

export interface ReceptionCreationStore {
    loading: boolean;
    reception?: ReplenishmentOperation;
    productsByUuid: Items<Product>;
}

export type ReceptionQuantitiesById = Record<
    string,
    {
        type: string | undefined;
        received: number;
        damaged: number;
        missing: number;
        packaging: LogisticUnit['packaging'];
        logistic_unit_items: LogisticUnit['logistic_unit_items'];
        price: LogisticUnit['price'] | number;
    }
>;
