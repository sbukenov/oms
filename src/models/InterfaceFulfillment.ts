import { NavigateFunction } from 'react-router';
import { Owner, Headers } from '@bo/utils';

import { FulfillmentStatusCodes, FulfillmentItemStatusCodes, PickingStatusCodes } from '~/models';

import { Quantity } from './InterfaceQuantity';
import { Transition } from './InterfaceTransition';

export interface FulfilledItems {
    id: string;
    label: string;
    picking_status: PickingStatusCodes;
    quantity: Quantity;
}

export type FulfilledItemsQuantity = Partial<Record<PickingStatusCodes, number>>;

export interface FulfillmentItem {
    id: string;
    label: string;
    product: string;
    created_at: string;
    updated_at: string;
    order_line: {
        id: string;
        merchant_ref: string;
        image_url: string | null;
    };
    completion: FulfillmentItemStatusCodes;
    quantity: Quantity;
    fulfilled_items_quantities: FulfilledItemsQuantity;
    fulfilled_items?: FulfilledItems[];
    isSubstitute?: boolean;
    picking_status?: PickingStatusCodes;
}

export interface Fulfillment {
    id: string;
    reference: string | null;
    url?: string;
    created_at: string;
    updated_at: string;
    status: FulfillmentStatusCodes;
    cancelled_at: string | null;
    owner: Owner;
    order: {
        id: string;
        merchant_ref: string;
        url: string;
    };
    fulfillment_items?: FulfillmentItem[];
    items?: FulfillmentItem[];
}

export interface OrderFulfillmentDetailed {
    id: string;
    merchant_ref: string;
    url: string;
    fulfillments?: Fulfillment[];
}

export interface TransitFulfillmentItemsBody {
    fulfillment_items: Array<{
        fulfillment_item_id: string;
        transition: Transition;
    }>;
}

export interface CompleteFulfillmentBody {
    fulfillment_items: Array<{
        fulfillment_item_id: string;
        fulfilled_items: Array<{
            quantity: number;
            picking_status: string;
            product_reference?: string;
            product_label?: string;
            quantity_per_item?: string;
            unit?: string;
        }>;
    }>;
}

export interface FulfillmentPreparePayload {
    fulfillmentId: string;
    navigate: NavigateFunction;
    state: unknown;
}

export interface confirmPreparationPayload {
    fulfillmentId: string;
    navigate: NavigateFunction;
    state: unknown;
}

export interface AddOutOfStockPayload {
    item: FulfillmentItem;
    quantityOutOfStock: number;
}

export interface CancelOutOfStockPayload {
    item: FulfillmentItem;
}

export type FulfillmentsData = {
    fulfillments: Fulfillment[];
};

export type FulfillmentsResponseData = FulfillmentsData & {
    filters: any;
};

export interface GetAllFulfillmentsSuccessPayload {
    data: FulfillmentsData;
    headers: Headers;
    filters?: any;
}
