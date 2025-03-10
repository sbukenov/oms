import type { OrdersTableColumn, OrdersTableDefaultColumns } from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__ORDER_LIST: OrdersTableColumn[] = [
    { column: 'REFERENCE' },
    { column: 'CUSTOMER' },
    { column: 'OWNER' },
    { column: 'STATUS' },
    { column: 'FULFILLMENT_STATUS' },
    { column: 'SHIPMENT_STATUS' },
    { column: 'CREATED_DATE' },
    { column: 'DELIVERY_DATE' },
];

export const CONFIG_COLUMN__ORDER_LIST: { [key in OrdersTableDefaultColumns]?: OrdersTableColumn } = {
    CREATED_DATE: {
        custom: {
            path: 'created_at',
            title: {
                en: 'Order creation date',
                fr: 'Date de création',
            },
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    DELIVERY_DATE: {
        custom: {
            path: ['shipment', 'delivery_date'],
            title: {
                en: 'Delivery date',
                fr: 'Date de livraison',
            },
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    CUSTOMER: {
        custom: {
            path: ['customer', 'name'],
            title: {
                en: 'Customer',
                fr: 'Client',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: {
                width: '15%',
            },
        },
    },
    OWNER: {
        custom: {
            path: ['owner', 'label'],
            title: {
                en: 'Entity',
                fr: 'Entité',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: {
                width: '15%',
            },
        },
    },
    PROMISED_DELIVERY_DATE: {
        custom: {
            path: 'promised_delivery_date',
            title: {
                en: 'Promised delivery date',
                fr: 'Date de livraison prévue',
            },
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    SUPPLIER: {
        custom: {
            path: ['owner', 'label'],
            title: {
                en: 'Supplier',
                fr: 'Fournisseur',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: {
                width: '15%',
            },
        },
    },
    INITIAL_TOTAL_AMOUNT_INCLUDING_VAT: {
        custom: {
            path: ['total_amounts', 'initial_total_amount_including_vat'],
            title: {
                en: 'Total amount',
                fr: 'Montant total',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const DEFAULT_FILTER__ORDER_LIST = {
    shape: 'drawer',
    filterGroups: {
        status: [
            {
                key: 'status',
                type: 'multiselectStatuses',
                statusGroup: 'order',
                statusGroupBE: 'Order',
                label: 'order_status',
                tooltip: 'order_status',
                placeholder: 'select',
            },
            {
                key: 'fulfillment_status',
                type: 'multiselectStatuses',
                statusGroup: 'orderFulfillment',
                statusGroupBE: 'OrderFulfillmentStatus',
                label: 'fulfillment_status',
                tooltip: 'fulfillment_status',
                placeholder: 'select',
            },
            {
                key: 'shipment_status',
                type: 'multiselectStatuses',
                statusGroup: 'orderShipment',
                statusGroupBE: 'OrderShipmentStatus',
                label: 'shipment_status',
                tooltip: 'shipment_status',
                placeholder: 'select',
            },
        ],
        dates: [
            {
                key: 'created_at',
                type: 'rangePicker',
                label: 'creation_date',
                disable: 'checkDateIsAfterToday',
            },
            {
                key: 'delivery_date',
                type: 'rangePicker',
                label: 'delivery_date',
                disable: 'checkDateIsAfterToday',
            },
            {
                key: 'promised_delivery_date',
                type: 'rangePicker',
                label: 'promised_delivery_date',
            },
        ],
        order_details: [
            {
                key: 'owner',
                type: 'multiselect',
                label: 'owner',
                object: 'businessUnits',
                placeholder: 'select',
            },
            {
                key: 'children',
                type: 'toggle',
                label: 'children',
                tooltip: 'children',
            },
            {
                key: 'type',
                type: 'multiselect',
                label: 'order_type',
                object: 'Order',
                placeholder: 'select',
            },
        ],
    },
};
