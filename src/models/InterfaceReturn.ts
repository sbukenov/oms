import { Owner, Headers } from '@bo/utils';

import { ReturnStatusCodes, ReturnItemStatusCodes } from './InterfaceStatusInfo';
import { NavigateFunction } from 'react-router';

export interface OrderReturns {
    orderId?: string;
    returns: OrderReturn[];
}

export interface OrderReturn {
    id: string;
    status: ReturnStatusCodes;
    created_at: string;
    updated_at: string | null;
    type: string;
    owner: Owner;
    cancelled_at: string | null;
    customer: {
        reference: string;
        name: string;
        url: string;
    };
    merchant_ref: string | null;
    reason: string;
    items: ReturnItem[];
    order: {
        id: string;
        merchant_ref: string;
        url: string;
    };
}

export interface ReturnItem {
    id: string;
    order_line: {
        id: string;
        merchant_ref: string;
        label: string;
        image_url: string | null;
    };
    status: ReturnItemStatusCodes | null;
    reason: string;
    label: string;
    reason_type: {
        id: string;
        label: string;
        url: string;
    };
    merchant_ref: string;
    quantity: number;
    quantity_per_item: number;
    unit: string;
    qualified_items: [];
    created_at: string;
    updated_at: string | null;
}

export interface ReturnReason {
    id: string;
    label: string;
    created_at: string;
    updated_at: string | null;
    deactivation_date: string | null;
    url: string;
}

export interface ItemToReturn {
    id?: string;
    reason: string;
    label: string;
    reason_type: string;
    merchant_ref: string | null;
    order_line_id: string;
    quantityLeft?: number;
    quantityToReturn: number;
    isItem: boolean;
}

export interface OrderLinesToReturn {
    id: string;
    reference: string | null;
    label: string;
    reason_type: string | undefined;
    reason: string | undefined;
    quantityLeft: number;
    maxQuantityLeft: number;
    quantityToReturn: number;
    items?: ItemToReturn[];
}

export interface CreateReturnsPayload {
    reason?: string;
    merchant_ref?: string;
    owner: string;
    type: string;
    items: {
        unit?: string;
        reason: string;
        label: string;
        reason_type: string;
        merchant_ref: string | null;
        order_line_id: string;
        quantity: number;
        quantity_per_item?: number;
    }[];
}

export interface CommonReturnInfo {
    entity: string;
    type: string;
    motives?: string;
}

export interface CreateReturnAction {
    idOrder: string;
    body: CreateReturnsPayload;
    navigate: NavigateFunction;
}

export type ReturnsData = {
    returns: OrderReturn[];
};

export type ReturnsResponseData = ReturnsData & {
    filters: unknown;
};

export interface GetAllReturnsSuccessPayload {
    data: ReturnsData;
    headers: Headers;
    filters?: any;
}
