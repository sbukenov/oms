import { FilterConfig } from '@bo/keystone-components';
import { Headers } from '@bo/utils';

import type {
    FulfillmentStatusCodes,
    ShipmentStatusCodes,
    OrderStatusCodes,
    TransactionStatusCodes,
    ReturnStatusCodes,
} from '../InterfaceStatusInfo';
import type { OrderFilter, OrdersData } from '../InterfaceOrders';
import { StatusGroups } from '../InterfaceStatusInfo';

export interface GetStatusesResponse {
    Order: OrderStatusCodes[];
    OrderFulfillmentStatus: FulfillmentStatusCodes[];
    OrderShipmentStatus: ShipmentStatusCodes[];
    Fulfillment: FulfillmentStatusCodes[];
    Shipment: ShipmentStatusCodes[];
    Transaction: TransactionStatusCodes[];
    OrderReturn: ReturnStatusCodes[];
}

export interface OrdersPageStore {
    table: {
        loading: boolean;
        data: OrdersData;
        next?: string;
        prev?: string;
        filters?: OrderFilter;
    };
    filters: Record<string, any>;
    search: string;
    route?: string;
}

export interface GetAllOrdersSuccessPayload {
    data: OrdersData;
    headers: Headers;
    filters?: OrderFilter;
}

export type LoadPayload = { route?: string; filterTabConfig?: FilterConfig<StatusGroups, GetStatusesResponse> };
export type SearchOrdersPayload = { filterTabConfig?: FilterConfig<StatusGroups, GetStatusesResponse> };
