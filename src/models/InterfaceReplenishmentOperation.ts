import { ShortUser, Owner, Price } from '@bo/utils';
import { Attachment } from './InterfaceAttachment';

import { OrderLine } from './InterfaceOrders';
import { ReplenishmentOperationStatusCodes } from './InterfaceStatusInfo';

export interface LogisticUnitPackagingItem {
    barcode: string;
    quantity: number;
    reception_state: Record<string, number>;
}

export interface LogisticUnitItem {
    barcode: string;
    reference: string;
    label: string;
    pim_uuid: string;
    image_url: string;
    quantity: number;
    batch_number: string | null;
    minimum_durability_date: string | null;
    expiry_date: string | null;
}

export interface LogisticUnit {
    auto_id?: string;
    id: string;
    type: string;
    barcode: string | null;
    reference: string | null;
    status: string | null;
    supplier_reference: string | null;
    packaging: {
        id: string;
        quantity: number;
        reference: string;
        label: string;
        barcode: string | null;
        items: LogisticUnitPackagingItem[];
    };
    price?: Price;
    initial_total_amount?: Price;
    url: string;
    logistic_unit_items: LogisticUnitItem[];
}

export type UnexpectedLogisticUnit = Omit<LogisticUnit, 'price'> & {
    price?: number;
    isUnexpected: boolean;
};

export interface ReplenishmentOperation {
    id: string;
    reference: string;
    barcode: string | null;
    type: string;
    recipient: Owner;
    shipper: Owner;
    status: ReplenishmentOperationStatusCodes;
    created_by: ShortUser;
    created_at: string;
    updated_at: string | null;
    cancelled_at: string | null;
    logistic_units: LogisticUnit[];
    attachments: Attachment[];
}

export interface ReplenishmentOperations {
    replenishment_operations: ReplenishmentOperation[];
}

export interface ReplenishmentOperationCreationData {
    type: string;
    reference: string | null;
    order_id: string;
    barcode?: string | null;
    recipient?: string;
    shipper?: string;
}

export interface LogisticUnitsBulkCreationData {
    replenishment_operation: string;
    logistic_units: {
        type: string;
        packaging: {
            id: string;
            quantity: number;
            items: [
                {
                    quantity: number;
                    barcode: string;
                },
            ];
        };
        logistic_unit_items: [
            {
                barcode: string;
                label: string;
                pim_uuid: string;
                image_url: string;
                quantity: number;
            },
        ];
    }[];
}

export type OrderLinesQuantitiesById = Record<
    string,
    { packaging: OrderLine['packaging']; price: number; quantity: number; type: string }
>;
