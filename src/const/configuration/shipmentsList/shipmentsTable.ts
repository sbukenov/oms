import type { ShipmentsTableColumn, ShipmentsTableDefaultColumns } from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__SHIPMENT_LIST: ShipmentsTableColumn[] = [
    { column: 'REFERENCE' },
    { column: 'ENTITY' },
    { column: 'STATUS' },
    { column: 'CREATION_DATE' },
    { column: 'DELIVERY_DATE' },
    { column: 'TRACKING_LINK' },
];

export const CONFIG_COLUMN__SHIPMENT_LIST: { [key in ShipmentsTableDefaultColumns]?: ShipmentsTableColumn } = {
    ENTITY: {
        custom: {
            path: ['issuer', 'label'],
            title: {
                en: 'Entity',
                fr: 'Entité',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    CREATION_DATE: {
        custom: {
            path: 'created_at',
            title: {
                en: 'Creation date',
                fr: 'Date de création',
            },
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    DELIVERY_DATE: {
        custom: {
            path: 'expected_delivery_date',
            title: {
                en: 'Expected delivery date',
                fr: 'Date de livraison prévue',
            },
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const DEFAULT_FILTER__SHIPMENT_LIST = {
    shape: 'drawer',
    filterGroups: {
        status: [
            {
                key: 'status',
                type: 'multiselectStatuses',
                statusGroup: 'shipment',
                statusGroupBE: 'Shipment',
                label: 'status',
                placeholder: 'select',
            },
            {
                key: 'issuer',
                type: 'multiselect',
                label: 'owner',
                object: 'businessUnits',
                placeholder: 'select',
            },
            {
                key: 'created_at',
                type: 'rangePicker',
                label: 'creation_date',
                disable: 'checkDateIsAfterToday',
            },
        ],
    },
};
