import type { Fulfillment } from '../InterfaceFulfillment';
import type { OrderFulfillmentDetailed } from '../InterfaceFulfillment';

export interface FulfillmentsStore {
    orderFulfillmentDetailed: {
        loading: boolean;
        data?: OrderFulfillmentDetailed;
    };
    fulfillmentPreparation: {
        loading: boolean;
        data?: Fulfillment;
    };
    table: {
        loading: boolean;
        fulfillments: Fulfillment[];
        headers: {
            next?: string;
            prev?: string;
        };
        filters: Record<string, any>;
        search: string;
        route?: string;
    };
}
