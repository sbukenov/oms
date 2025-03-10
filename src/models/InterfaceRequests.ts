import type { FulfillmentStatusCodes, ShipmentStatusCodes, OrderStatusCodes } from '~/models';

export type OrdersListFilters = Partial<{
    'created_at[from]': string;
    'created_at[to]': string;
    'delivery_date[from]': string;
    'delivery_date[to]': string;
    'promised_delivery_date[from]': string;
    'promised_delivery_date[to]': string;
    status: OrderStatusCodes[];
    shipment_status: ShipmentStatusCodes[];
    fulfillment_status: FulfillmentStatusCodes[];
    owner: string[];
    type: string[];
    isCancelled: boolean;
    children: boolean;
}>;

export type OrderListRequestParams = OrdersListFilters & {
    page?: string;
    search?: string;
};

export interface ServerError {
    message: string;
    originalError: {
        response: {
            data: {
                title: string;
            };
        };
    };
}
