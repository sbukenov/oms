import type { AvailableLanguages } from '@types/bo-module-aggregator';
import { DefaultOptionType } from 'antd/lib/select';

export const enum OrderStatusCodes {
    CREATED = 'CREATED',
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export const enum OrderFulfillmentStatusCodes {
    AWAITING_FULFILLMENT = 'AWAITING_FULFILLMENT',
    TO_PREPARE = 'TO_PREPARE',
    PREPARING = 'PREPARING',
    PARTIALLY_PICKED = 'PARTIALLY_PICKED',
    PICKED = 'PICKED',
    PREPARATION_REFUSED = 'PREPARATION_REFUSED',
    CANCELLED = 'CANCELLED',
}

export const enum OrderShipmentStatusCodes {
    AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',
    TO_DELIVER = 'TO_DELIVER',
    DELIVERING = 'DELIVERING',
    PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export const enum ReplenishmentOperationStatusCodes {
    AWAITING_RECEPTION = 'AWAITING_RECEPTION',
    RECEIVING = 'RECEIVING',
    PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
    RECEIVED = 'RECEIVED',
    REFUSED = 'REFUSED',
}
export const enum ReturnItemStatusCodes {
    CANCELLED = 'CANCELLED',
}

export const enum ReturnStatusCodes {
    CREATED = 'CREATED',
    REFUSED = 'REFUSED',
    VALIDATED = 'VALIDATED',
    QUALIFIYING = 'QUALIFIYING',
    QUALIFIED = 'QUALIFIED',
    CANCELLED = 'CANCELLED',
}

export const enum FulfillmentStatusCodes {
    TO_PREPARE = 'TO_PREPARE',
    PREPARING = 'PREPARING',
    PARTIALLY_PICKED = 'PARTIALLY_PICKED',
    PICKED = 'PICKED',
    UNABLE_TO_PREPARE = 'UNABLE_TO_PREPARE',
    REASSIGNED = 'REASSIGNED',
    CANCELLED = 'CANCELLED',
}

export const enum ShipmentStatusCodes {
    TO_SHIP = 'TO_SHIP',
    HANDED_TO_CARRIER = 'HANDED_TO_CARRIER',
    DELIVERING = 'DELIVERING',
    PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export const enum FulfillmentItemStatusCodes {
    TO_PROCESS = 'TO_PROCESS',
    PROCESSING = 'PROCESSING',
    PROCESSED = 'PROCESSED',
    UNABLE_TO_PROCESS = 'UNABLE_TO_PROCESS',
    CANCELLED = 'CANCELLED',
}

export const enum PickingStatusCodes {
    PICKED = 'PICKED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    SUBSTITUTE = 'SUBSTITUTE',
}

export const enum TransactionStatusCodes {
    CREATED = 'CREATED',
    REFUSED = 'REFUSED',
    VALIDATED = 'VALIDATED',
    REFUNDING = 'REFUNDING',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export type StatusCodes =
    | OrderStatusCodes
    | OrderFulfillmentStatusCodes
    | OrderShipmentStatusCodes
    | FulfillmentStatusCodes
    | ShipmentStatusCodes
    | FulfillmentItemStatusCodes
    | PickingStatusCodes
    | ReturnItemStatusCodes
    | ReturnStatusCodes
    | TransactionStatusCodes
    | ReplenishmentOperationStatusCodes;

export interface StatusInfo {
    color: string;
    title: Record<AvailableLanguages, string>;
}

/**
 * Generate an interface with any info about status code for the corresponding group status
 * @param  {any} Info - describes an interface for the status code information
 */
export type CreateStatusesByStatusGroup<Info> = {
    order: Record<OrderStatusCodes, Info>;
    orderFulfillment: Record<OrderFulfillmentStatusCodes, Info>;
    orderShipment: Record<OrderShipmentStatusCodes, Info>;
    orderReception: Record<ReplenishmentOperationStatusCodes, Info>;
    orderExpedition: Record<ReplenishmentOperationStatusCodes, Info>;
    fulfillment: Record<FulfillmentStatusCodes, Info>;
    shipment: Record<ShipmentStatusCodes, Info>;
    return: Record<ReturnStatusCodes, Info>;
    fulfillmentItem: Record<FulfillmentItemStatusCodes, Info>;
    returnItem: Record<ReturnItemStatusCodes, Info>;
    picking: Record<PickingStatusCodes, Info>;
    transaction: Record<TransactionStatusCodes, Info>;
};

/**
 * @return  {
 *     order: {
 *         CREATED: {
 *             color: string;
 *             title: {
 *                 en: string;
 *                 fr: string;
 *             }
 *         },
 *         CONFIRMED: {
 *             color: string;
 *             title: {
 *                 en: string;
 *                 fr: string;
 *             }
 *         },
 *         PROCESSING: { ... },
 *         READY: { ... },
 *         COMPLETED: { ... },
 *     }
 *     orderFulfillment: {
 *         AWAITING_FULFILLMENT: {
 *             color: string;
 *             title: {
 *                 en: string;
 *                 fr: string;
 *             }
 *         },
 *         TO_PREPARE: {
 *             color: string;
 *             title: {
 *                 en: string;
 *                 fr: string;
 *             }
 *         },
 *         ...
 *     }
 *     ...
 * }
 */
export type StatusesByStatusGroup = CreateStatusesByStatusGroup<StatusInfo>;

export type StatusGroups = keyof StatusesByStatusGroup;

export interface StatusOption extends DefaultOptionType {
    title: string;
}
