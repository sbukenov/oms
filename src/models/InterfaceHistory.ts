import type {
    FulfillmentStatusCodes,
    OrderFulfillmentStatusCodes,
    OrderShipmentStatusCodes,
    OrderStatusCodes,
    ReturnStatusCodes,
    ShipmentStatusCodes,
    TransactionStatusCodes,
} from './InterfaceStatusInfo';

/*
    There are more history types that are generated by the api,
    but we only handle the ones that are listed here
*/
export const enum HistoryEventIdTypes {
    OrderShipmentStatusChanged = 'oms_core.order_shipment_status.status_changed',
    OrderFulfillmentStatusChanged = 'oms_core.order_fulfillment_status.status_changed',
    OrderStatusChanged = 'oms_core.order.status_changed',
    OrderCancelled = 'oms_core.order.cancelled',
    OrderCommentCreated = 'oms_core.order_comment.created',
    OrderCommentUpdated = 'oms_core.order_comment.updated',
    OrderCommentDeleted = 'oms_core.order_comment.deleted',
    FulfillmentCreated = 'oms_core.fulfillment.created',
    FulfillmentStatusChanged = 'oms_core.fulfillment.status_changed',
    FulfillmentCancelled = 'oms_core.fulfillment.cancelled',
    ShipmentCreated = 'oms_core.shipment.created',
    ShipmentStatusChanged = 'oms_core.shipment.status_changed',
    ShipmentCancelled = 'oms_core.shipment.cancelled',
    OrderShippingAddressUpdated = 'oms_core.order_shipping_address.updated',
    OrderReturnCreated = 'oms_core.order_return.created',
    OrderReturnStatusChanged = 'oms_core.order_return.status_changed',
    OrderReturnCancelled = 'oms_core.order_return.cancelled',
    OrderBillingAddressUpdated = 'oms_core.order_billing_address.updated',
    OrderLineUpdated = 'oms_core.order_line.updated',
    TransactionCreated = 'oms_core.transaction.created',
    TransactionStatusChanged = 'oms_core.transaction.status_changed',
    TransactionCancelled = 'oms_core.transaction.cancelled',
    ExpeditionCreated = 'stock_operation.expedition.created',
    ReceptionCreated = 'stock_operation.reception.created',
}

export const enum SubjectTypes {
    OrderShipmentStatus = 'OrderShipmentStatus',
    OrderFulfillmentStatus = 'OrderFulfillmentStatus',
    Order = 'Order',
    Comment = 'Comment',
    Fulfillment = 'Fulfillment',
    Shipment = 'Shipment',
    ShipmentAddress = 'Shipment address',
    Return = 'Return',
    BillingAddress = 'Billing address',
    OrderLine = 'Order line',
    Transaction = 'Transaction',
    Reception = 'Reception',
    Expedition = 'Expedition',
}

interface PlainStringChange {
    before: string;
    after: string;
}

export interface OrderHistoryEventBase {
    id: string;
    app_id: string | null;
    user: {
        id: string;
        first_name: string;
        last_name: string;
    } | null;
    subject_id: string | null;
    created_at: string;
}

export interface OrderShipmentStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderShipmentStatusChanged;
    state: {
        status: {
            after: OrderShipmentStatusCodes;
            before: OrderShipmentStatusCodes;
            transition: string;
        };
    };
    subject_type: SubjectTypes.OrderShipmentStatus;
}

export interface OrderFulfillmentStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderFulfillmentStatusChanged;
    state: {
        status: {
            after: OrderFulfillmentStatusCodes;
            before: OrderFulfillmentStatusCodes;
            transition: string;
        };
    };
    subject_type: SubjectTypes.OrderFulfillmentStatus;
}

export interface OrderStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderStatusChanged;
    state: {
        status: {
            after: OrderStatusCodes;
            before: OrderStatusCodes;
            transition: string;
        };
    };
    subject_type: SubjectTypes.Order;
}

export interface OrderCancelledAtChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderCancelled;
    state: {
        cancelled_at: {
            after: string;
            before: null;
        };
    };
    subject_type: SubjectTypes.Order;
}

export interface OrderCommentCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderCommentCreated;
    state: {
        content: PlainStringChange;
        title: PlainStringChange;
    };
    subject_type: SubjectTypes.Comment;
}

export interface OrderCommentUpdatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderCommentUpdated;
    state: {
        content?: PlainStringChange;
        title?: PlainStringChange;
    };
    subject_type: SubjectTypes.Comment;
}

export interface OrderCommentDeletedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderCommentDeleted;
    state: {
        content: PlainStringChange;
        title: PlainStringChange;
    };
    subject_type: SubjectTypes.Comment;
}

export interface FulfillmentCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.FulfillmentCreated;
    state: [];
    subject_type: SubjectTypes.Fulfillment;
}

export interface FulfillmentStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.FulfillmentStatusChanged;
    state: {
        status: {
            before: FulfillmentStatusCodes;
            after: FulfillmentStatusCodes;
        };
    };
    subject_type: SubjectTypes.Fulfillment;
}

export interface ShipmentCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.ShipmentCreated;
    state: [];
    subject_type: SubjectTypes.Shipment;
}

export interface ShipmentStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.ShipmentStatusChanged;
    state: {
        status: {
            before: ShipmentStatusCodes;
            after: ShipmentStatusCodes;
        };
    };
    subject_type: SubjectTypes.Shipment;
}

export interface FulfillmentCancelledChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.FulfillmentCancelled;
    state: {
        cancelled_at: {
            before: null;
            after: string;
        };
    };
    subject_type: SubjectTypes.Fulfillment;
}

export interface ShipmentCancelledChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.ShipmentCancelled;
    state: {
        cancelled_at: {
            before: null;
            after: string;
        };
    };
    subject_type: SubjectTypes.Shipment;
}

export interface OrderShippingAddressUpdatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderShippingAddressUpdated;
    state: {
        email: PlainStringChange;
        name: PlainStringChange;
        phone: PlainStringChange;
        postalCode: PlainStringChange;
    };
    subject_type: SubjectTypes.ShipmentAddress;
}

export interface OrderReturnCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderReturnCreated;
    state: [];
    subject_type: SubjectTypes.Return;
}

export interface OrderReturnStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderReturnStatusChanged;
    state: {
        status: {
            before: ReturnStatusCodes;
            after: ReturnStatusCodes;
        };
    };
    subject_type: SubjectTypes.Return;
}

export interface OrderBillingAddressChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderBillingAddressUpdated;
    state: {
        email: PlainStringChange;
        name: PlainStringChange;
        phone: PlainStringChange;
        postalCode: PlainStringChange;
    };
    subject_type: SubjectTypes.BillingAddress;
}

export interface OrderLineUpdatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderLineUpdated;
    state: {
        label: PlainStringChange;
        reference: PlainStringChange;
    };
    subject_type: SubjectTypes.OrderLine;
}

export interface TransactionCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.TransactionCreated;
    state: [];
    subject_type: SubjectTypes.Transaction;
}

export interface TransactionStatusChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.TransactionStatusChanged;
    state: {
        status: {
            before: TransactionStatusCodes;
            after: TransactionStatusCodes;
        };
    };
    subject_type: SubjectTypes.Transaction;
}

export interface TransactionCancelledChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.TransactionCancelled;
    state: {
        cancelled_at: {
            before: null;
            after: string;
        };
    };
    subject_type: SubjectTypes.Transaction;
}

export interface OrderReturnCancelledChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.OrderReturnCancelled;
    state: {
        cancelled_at: {
            before: null;
            after: string;
        };
    };
    subject_type: SubjectTypes.Return;
}

export interface ExpeditionCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.ExpeditionCreated;
    state: [];
    subject_type: SubjectTypes.Expedition;
}

export interface ReceptionCreatedChange extends OrderHistoryEventBase {
    event_id: HistoryEventIdTypes.ReceptionCreated;
    state: [];
    subject_type: SubjectTypes.Reception;
}

export type OrderHistoryEvent =
    | OrderShipmentStatusChange
    | OrderFulfillmentStatusChange
    | OrderStatusChange
    | OrderCancelledAtChange
    | OrderCommentCreatedChange
    | OrderCommentUpdatedChange
    | OrderCommentDeletedChange
    | FulfillmentCreatedChange
    | FulfillmentStatusChange
    | ShipmentCreatedChange
    | ShipmentStatusChange
    | FulfillmentCancelledChange
    | ShipmentCancelledChange
    | OrderShippingAddressUpdatedChange
    | OrderReturnCreatedChange
    | OrderReturnStatusChange
    | OrderBillingAddressChange
    | OrderLineUpdatedChange
    | TransactionCreatedChange
    | TransactionStatusChange
    | TransactionCancelledChange
    | OrderReturnCancelledChange
    | ExpeditionCreatedChange
    | ReceptionCreatedChange;

export interface History {
    object:
        | {
              id: string;
              merchant_ref: string;
              url: string;
          }
        | undefined;
    object_events: OrderHistoryEvent[];
    pagination:
        | {
              max_items: number;
              page: number;
              total: number;
          }
        | undefined;
}

export interface HistoryRequestParams {
    maxItems?: number;
    page?: number;
}

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never;

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
    [V in T[K]]: DiscriminateUnion<T, K, V>;
};

export type HistoryEventHandlersMap = MapDiscriminatedUnion<OrderHistoryEvent, 'event_id'>;
