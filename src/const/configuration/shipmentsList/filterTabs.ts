import type { CustomActionConfiguration } from '@-bo/utils';
import { TabFilter } from '@-bo/keystone-components';

import { GetStatusesResponse, ShipmentsTableColumn, StatusGroups } from '~/models';

import { DEFAULT_FILTER__SHIPMENT_LIST } from './shipmentsTable';

export const DEFAULT_FILTER_TABS__SHIPMENTS = [
    {
        key: 'all',
        title: {
            en: 'All',
            fr: 'Toutes',
        },
        url: '/shipments',
        filters: DEFAULT_FILTER__SHIPMENT_LIST,
        actions: [
            {
                name: 'export-shipments-csv',
                type: 'download',
                icon: ['', 'download'],
                label: {
                    en: 'Export in CSV',
                    fr: 'Exporter en CSV',
                },
                custom: {
                    request: {
                        url: '{url}/shipments/export',
                        method: 'get',
                        extra_params: {
                            status: 'data.filters.status',
                            'created_at[from]': 'data.filters.created_at[0]',
                            'created_at[to]': 'data.filters.created_at[1]',
                            issuer: 'data.filters.issuer',
                            search: 'data.search',
                            isCancelled: 'data.filters.isCancelled',
                        },
                    },
                    success_notification: {
                        title: {
                            en: 'Success',
                            fr: 'Succès',
                        },
                        body: {
                            en: 'The CSV document has been downloaded',
                            fr: 'Le fichier CSV a bien été téléchargé',
                        },
                    },
                },
            },
        ] as CustomActionConfiguration[],
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
        },
        url: '/shipments?isCancelled=true',
        actions: [
            {
                name: 'export-shipments-csv',
                type: 'download',
                icon: ['', 'download'],
                label: {
                    en: 'Export in CSV',
                    fr: 'Exporter en CSV',
                },
                custom: {
                    request: {
                        url: '{url}/shipments/export',
                        method: 'get',
                        extra_params: {
                            'created_at[from]': 'data.filters.created_at[0]',
                            'created_at[to]': 'data.filters.created_at[1]',
                            issuer: 'data.filters.issuer',
                            search: 'data.search',
                            isCancelled: true,
                        },
                    },
                    success_notification: {
                        title: {
                            en: 'Success',
                            fr: 'Succès',
                        },
                        body: {
                            en: 'The CSV document has been downloaded',
                            fr: 'Le fichier CSV a bien été téléchargé',
                        },
                    },
                },
            },
        ],
    },
] as TabFilter<ShipmentsTableColumn, StatusGroups, GetStatusesResponse>[];
