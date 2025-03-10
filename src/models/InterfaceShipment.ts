import { Owner, Headers } from '@bo/utils';

import { ShipmentStatusCodes } from './InterfaceStatusInfo';
import { Attachment } from './InterfaceAttachment';

export type ShipmentShort = Pick<Shipment, 'id' | 'status' | 'delivery_date'>;

export interface OrderShipments {
    orderId?: string;
    shipments: OrderShipment[];
}

export interface OrderShipment {
    id: string;
    issuer: Owner;
    status: ShipmentStatusCodes;
    tracking_link: string | null;
    reference: string | null;
    cancelled_at: string | null;
    expected_delivery_date: string | null;
    created_at: string;
    updated_at: string | null;
    delivery_date: string | null;
    shipping_address: Address;
    items: ShipmentItem[];
    attachments: Attachment[];
}

export interface Address {
    id: string;
    name: string | null;
    line_1: string | null;
    line_2: string | null;
    line_3: string | null;
    postal_code: string | null;
    country_code: string | null;
    city: string | null;
    email: string | null;
    phone: string | null;
    comment: string | null;
    type: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface ShipmentItem {
    id: string;
    label: string | null;
    order_line: {
        id: string;
        merchant_ref: string;
        image_url: string | null;
    };
    quantity: {
        quantity: number;
        per_item: number | null;
        unit: string | null;
    };
}

export interface ShipmentItemShort {
    order_line: string;
    quantity: number;
}

export interface ShipmentCreationPayload {
    issuer: string;
    type: string;
    shipment_items: ShipmentItemShort[];
}

export interface ShipmentList {
    shipments: Shipment[];
}

export type Shipment = {
    id: string;
    url: string;
    order: {
        id: string;
        merchant_ref: string;
        url: string;
    };
    status: ShipmentStatusCodes;
    cancelled_at: string | null;
    reference: string | null;
    issuer: Owner;
    expected_delivery_date: string | null;
    created_at: string;
    updated_at: string | null;
    delivery_date: string | null;
    attachments: Attachment[] | null;
};

export interface GetAllShipmentsSuccessPayload {
    data: ShipmentList;
    headers: Headers;
}
