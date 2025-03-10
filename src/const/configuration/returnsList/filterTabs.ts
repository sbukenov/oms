import { DEFAULT_FILTER__RETURN_LIST } from './returnsTable';
import { TabFilter } from '@bo/keystone-components';

import { GetStatusesResponse, ReturnsTableColumn, StatusGroups } from '~/models';

export const DEFAULT_FILTER_TABS__RETURNS = [
    {
        key: 'all',
        title: {
            en: 'All',
            fr: 'Toutes',
        },
        filters: DEFAULT_FILTER__RETURN_LIST,
        url: '/returns',
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
        url: '/returns?isCancelled=true',
    },
] as TabFilter<ReturnsTableColumn, StatusGroups, GetStatusesResponse>[];
