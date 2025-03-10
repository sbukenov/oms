import { TabFilter } from '@-bo/keystone-components';

import { GetStatusesResponse, TransactionsTableColumn, StatusGroups } from '~/models';

import { DEFAULT_FILTER__TRANSACTION_LIST } from './transactionsTable';

export const DEFAULT_FILTER_TABS__TRANSACTIONS = [
    {
        key: 'all',
        title: {
            en: 'All',
            fr: 'Toutes',
        },
        filters: DEFAULT_FILTER__TRANSACTION_LIST,
        url: '/transactions',
    },
    {
        key: 'cancelled',
        title: {
            en: 'Cancelled',
            fr: 'Annulés',
        },
        filters: {
            shape: 'drawer',
            filterGroups: {
                status: [
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
        },
        url: '/transactions?isCancelled=true',
    },
] as TabFilter<TransactionsTableColumn, StatusGroups, GetStatusesResponse>[];
