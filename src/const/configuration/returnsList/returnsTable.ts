import type { ReturnsTableColumn, ReturnsTableDefaultColumns } from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__RETURN_LIST: ReturnsTableColumn[] = [
    { column: 'REFERENCE' },
    { column: 'CUSTOMER' },
    { column: 'OWNER' },
    { column: 'STATUS' },
    { column: 'CREATED_DATE' },
];

export const CONFIG_COLUMN__RETURN_LIST: { [key in ReturnsTableDefaultColumns]?: ReturnsTableColumn } = {
    CUSTOMER: {
        custom: {
            path: ['customer', 'name'],
            title: {
                en: 'Customer name',
                fr: 'Nom du client',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
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
};

export const DEFAULT_FILTER__RETURN_LIST = {
    shape: 'drawer',
    filterGroups: {
        status: [
            {
                key: 'status',
                type: 'multiselectStatuses',
                statusGroup: 'return',
                statusGroupBE: 'OrderReturn',
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
