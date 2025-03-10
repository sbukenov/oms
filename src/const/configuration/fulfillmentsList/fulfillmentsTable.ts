import type { FulfillmentsTableColumn, FulfillmentsTableDefaultColumns } from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__FULFILLMENT_LIST: FulfillmentsTableColumn[] = [
    { column: 'REFERENCE' },
    { column: 'OWNER' },
    { column: 'STATUS' },
    { column: 'CREATED_DATE' },
];

export const CONFIG_COLUMN__FULFILLMENT_LIST: { [key in FulfillmentsTableDefaultColumns]?: FulfillmentsTableColumn } = {
    CREATED_DATE: {
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
    OWNER: {
        custom: {
            path: ['owner', 'label'],
            title: {
                en: 'Entity',
                fr: 'Entité',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: {
                width: '25%',
            },
        },
    },
};

export const DEFAULT_FILTER__FULFILLMENT_LIST = {
    shape: 'drawer',
    filterGroups: {
        status: [
            {
                key: 'status',
                type: 'multiselectStatuses',
                statusGroup: 'orderFulfillment',
                statusGroupBE: 'OrderFulfillmentStatus',
                label: 'status',
                placeholder: 'select',
            },
            {
                key: 'owner',
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
