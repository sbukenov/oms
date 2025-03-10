import { TabFilter } from '@bo/keystone-components';

import { GetStatusesResponse, FulfillmentsTableColumn, StatusGroups } from '~/models';

import { DEFAULT_FILTER__FULFILLMENT_LIST } from './fulfillmentsTable';

export const DEFAULT_FILTER_TABS__FULFILLMENTS = [
    {
        key: 'all',
        title: {
            en: 'All',
            fr: 'Toutes',
        },
        filters: DEFAULT_FILTER__FULFILLMENT_LIST,
        url: '/fulfillments',
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
                ],
            },
        },
        url: '/fulfillments?isCancelled=true',
    },
] as TabFilter<FulfillmentsTableColumn, StatusGroups, GetStatusesResponse>[];
