import { ActionType, CustomActionConfiguration, HTTPmethod } from '@bo/utils';

import type {
    OrderFulfillmentTableColumn,
    OrderFulfillmentTableDefaultColumns,
    FulfillmentAdditionalInfoDefaultLines,
    FulfillmentAdditionalInfoLines,
} from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__FULFILLMENT_DETAILS: OrderFulfillmentTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'STATUS' },
    { column: 'ORDERED' },
    { column: 'PICKED' },
    { column: 'OUT_OF_STOCK' },
    { column: 'SUBSTITUTE' },
];

export const CONFIG_COLUMN__FULFILLMENT_DETAILS: {
    [key in OrderFulfillmentTableDefaultColumns]?: OrderFulfillmentTableColumn;
} = {
    PICKED: {
        custom: {
            path: ['fulfilled_items_quantities', 'PICKED'],
            title: {
                en: 'Prepared',
                fr: 'Préparé',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    OUT_OF_STOCK: {
        custom: {
            path: ['fulfilled_items_quantities', 'OUT_OF_STOCK'],
            title: {
                en: 'Out of stock',
                fr: 'En rupture',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    SUBSTITUTE: {
        custom: {
            path: ['fulfilled_items_quantities', 'SUBSTITUTE'],
            title: {
                en: 'Substituted',
                fr: 'Substitué',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const FULFILLMENT_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'cancel-fulfillment',
        icon: ['', 'close'],
        label: {
            en: 'Cancel the fulfillment',
            fr: "Annuler l'ordre de préparation",
        },
        privilege: 'oms-v2.fulfillment.cancel',
        rules: {
            'fulfillment.cancelled_at': {
                equals: null,
            },
            'fulfillment.status': {
                not: {
                    equals: 'PICKED',
                },
            },
            'order.fulfillment.status': {
                not: {
                    equals: 'PICKED',
                },
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderFulfillments', 'history'],
            request: {
                url: '{url}/fulfillments/{fulfillment.id}/cancellation',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Cancel the fulfillment',
                    fr: "Annuler l'ordre de préparation",
                },
                body: {
                    en: 'Are you sure you want to cancel that Fulfillment?',
                    fr: 'Êtes-vous sûr de ne pas pouvoir annuler cet ordre de préparation?',
                },
                inputs: [
                    {
                        label: { en: 'Cancellation reason', fr: "Motif d'annulation" },
                        key: 'id',
                        type: 'select',
                        options: {
                            route: '{url}/cancellations/reasons?object[]=fulfillment&is_active=true',
                            fieldNames: {
                                value: 'id',
                                label: 'label',
                            },
                        },
                    },
                ],
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The Fulfillment has been succefully cancelled',
                    fr: "L'ordre de préparation a bien été annulé",
                },
            },
        },
    },
    {
        name: 'create-shipment',
        label: {
            en: 'Ship preparation',
            fr: 'Livrer la préparation',
        },
        privilege: 'oms-v2.shipment.create',
        rules: {
            'fulfillment.cancelled_at': {
                equals: null,
            },
            'fulfillment.status': {
                equals: 'PICKED',
            },
            'fulfillment.fulfillment_items.length': {
                not: {
                    equals: 0,
                },
            },
        },
    },
    {
        name: 'download-bill',
        icon: ['', 'download'],
        type: ActionType.download,
        label: {
            en: 'Download the preparatory bill',
            fr: 'Télécharger le bon de préparation',
        },
        custom: {
            refresh: ['orderDetails', 'orderFulfillments', 'history'],
            request: {
                url: '{url}/fulfillments/{fulfillment.id}/download',
                method: HTTPmethod.get,
                mimeType: 'application/pdf',
                config: {
                    responseType: 'arraybuffer',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The PDF document has been downloaded',
                    fr: 'Le fichier PDF a bien été téléchargé',
                },
            },
        },
    },
];

export const SHORT_CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO: FulfillmentAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'UPDATED_AT' },
];

export const CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO: {
    [key in FulfillmentAdditionalInfoDefaultLines]: FulfillmentAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Сréé le',
            },
            path: ['fulfillment', 'created_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    UPDATED_AT: {
        custom: {
            title: {
                en: 'Updated at',
                fr: 'Modifié le',
            },
            path: ['fulfillment', 'updated_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};
