import type { TransactionsTableColumn, TransactionsTableDefaultColumns } from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__TRANSACTION_LIST: TransactionsTableColumn[] = [
    { column: 'REFERENCE' },
    { column: 'ENTITY' },
    { column: 'TYPE' },
    { column: 'STATUS' },
    { column: 'CREATION_DATE' },
    { column: 'AMOUNT_EXCL_VAT' },
    { column: 'AMOUNT' },
    { column: 'AMOUNT_INCL_VAT' },
];

export const CONFIG_COLUMN__TRANSACTION_LIST: { [key in TransactionsTableDefaultColumns]?: TransactionsTableColumn } = {
    ENTITY: {
        custom: {
            path: ['owner', 'label'],
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
    AMOUNT_EXCL_VAT: {
        custom: {
            path: ['total_amounts', 'total_amount_excluding_vat'],
            title: {
                en: 'Total amount excl. VAT',
                fr: 'Total HT',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    AMOUNT: {
        custom: {
            path: ['total_amounts', 'total_vat'],
            title: {
                en: 'Total VAT',
                fr: 'Total TVA',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    AMOUNT_INCL_VAT: {
        custom: {
            path: ['total_amounts', 'total_amount_including_vat'],
            title: {
                en: 'Total amount incl. VAT',
                fr: 'Total TTC',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const DEFAULT_FILTER__TRANSACTION_LIST = {
    shape: 'drawer',
    filterGroups: {
        status: [
            {
                key: 'status',
                type: 'multiselectStatuses',
                statusGroup: 'transaction',
                statusGroupBE: 'Transaction',
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
            {
                key: 'type',
                type: 'multiselect',
                label: 'type',
                object: 'Transaction',
                placeholder: 'select',
            },
        ],
    },
};
