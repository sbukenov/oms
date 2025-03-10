import { CustomActionConfiguration } from '@-bo/utils';
import { TabFilter } from '@-bo/keystone-components';

import { GetStatusesResponse, OrdersTableColumn, StatusGroups } from '~/models';
import { DEFAULT_FILTER__ORDER_LIST } from './ordersTable';

export const DEFAULT_FILTER_TABS = [
    {
        key: 'all',
        title: {
            en: 'All',
            fr: 'Toutes',
        },
        url: '/orders',
        filters: DEFAULT_FILTER__ORDER_LIST,
        actions: [
            {
                name: 'export-csv',
                type: 'download',
                icon: ['', 'download'],
                label: {
                    en: 'Export in CSV',
                    fr: 'Exporter en CSV',
                },
                custom: {
                    request: {
                        url: '{url}/orders/export',
                        method: 'get',
                        extra_params: {
                            status: 'data.filters.order',
                            fulfillment_status: 'data.filters.fulfillment_status',
                            shipment_status: 'data.filters.shipment_status',
                            'created_at[from]': 'data.filters.created_at[0]',
                            'created_at[to]': 'data.filters.created_at[1]',
                            'delivery_date[from]': 'data.filters.delivery_date[0]',
                            'delivery_date[to]': 'data.filters.delivery_date[1]',
                            'promised_delivery_date[from]': 'data.filters.promised_delivery_date[0]',
                            'promised_delivery_date[to]': 'data.filters.promised_delivery_date[1]',
                            owner: 'data.filters.owner',
                            type: 'data.filters.type',
                            search: 'data.search',
                            children: 'data.filters.children',
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
            {
                name: 'create-replenishment-order',
                icon: ['', 'add'],
                label: {
                    en: 'Create a replenishment order',
                    fr: 'Créer une commande de réaprovisionnement',
                },
                custom: {
                    request: {
                        redirection: '/{baseRoute}/orders/create',
                    },
                },
            },
        ] as CustomActionConfiguration[],
    },
    {
        key: 'cancelled',
        title: {
            en: 'Cancelled',
            fr: 'Annulées',
        },
        url: '/orders?isCancelled=true',
        filters: {
            shape: 'drawer',
            filterGroups: {
                dates: [
                    {
                        key: 'created_at',
                        type: 'rangePicker',
                        label: 'creation_date',
                        disable: 'checkDateIsAfterToday',
                    },
                    {
                        key: 'promised_delivery_date',
                        type: 'rangePicker',
                        label: 'promised_delivery_date',
                        tooltip: 'promised_delivery_date',
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
        },
    },
    {
        key: 'replenishment',
        title: {
            en: 'Replenishment',
            fr: 'Réaprovisionnement',
        },
        url: '/orders?type[]=replenishment',
        actions: [
            {
                name: 'export-csv',
                type: 'download',
                icon: ['', 'download'],
                label: {
                    en: 'Export in CSV',
                    fr: 'Exporter en CSV',
                },
                custom: {
                    request: {
                        url: '{url}/orders/export',
                        method: 'get',
                        extra_params: {
                            status: 'data.filters.status',
                            fulfillment_status: 'data.filters.fulfillment_status',
                            shipment_status: 'data.filters.shipment_status',
                            'created_at[from]': 'data.filters.created_at[0]',
                            'created_at[to]': 'data.filters.created_at[1]',
                            'delivery_date[from]': 'data.filters.delivery_date[0]',
                            'delivery_date[to]': 'data.filters.delivery_date[1]',
                            'promised_delivery_date[from]': 'data.filters.promised_delivery_date[0]',
                            'promised_delivery_date[to]': 'data.filters.promised_delivery_date[1]',
                            owner: ['replenishment'],
                            type: 'data.filters.type',
                            search: 'data.search',
                            children: 'data.filters.children',
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
            {
                name: 'create-replenishment-order',
                icon: ['', 'add'],
                label: {
                    en: 'Create a replenishment order',
                    fr: 'Créer une commande de réaprovisionnement',
                },
                custom: {
                    request: {
                        redirection: '/{baseRoute}/orders/create',
                    },
                },
            },
        ] as unknown as CustomActionConfiguration[],
    },
] as TabFilter<OrdersTableColumn, StatusGroups, GetStatusesResponse>[];
