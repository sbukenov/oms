import { CustomActionConfiguration, HTTPmethod,  } from '@bo/utils';

import type { OrderDetailsPanelLines, OrderDetailsPanelDefaultLines } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_LINES__SYNTHESIS_DETAILS_PANEL: OrderDetailsPanelLines[] = [
    { line: 'TYPE' },
    { line: 'DELIVERY_DATE' },
    { line: 'DELIVERY_AT' },
    { line: 'ADDRESS' },
];

export const SHORT_CONFIG_LINES__ORDER_DETAILS_PANEL: OrderDetailsPanelLines[] = [
    { line: 'TYPE' },
    { line: 'DELIVERY_DATE' },
    { line: 'DELIVERY_AT' },
    { line: 'CUSTOMER_NAME' },
    { line: 'ADDRESS' },
];

export const CONFIG_LINES__ORDER_DETAILS_PANEL: {
    [key in OrderDetailsPanelDefaultLines]?: OrderDetailsPanelLines;
} = {
    DELIVERY_DATE: {
        custom: {
            path: 'promised_delivery_date',
            title: {
                en: 'Promised delivery date',
                fr: 'Date de livraison prévue',
            },
            icon: [, 'calendar'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    DELIVERY_AT: {
        custom: {
            path: 'shipment.delivery_date',
            title: {
                en: 'Delivered at',
                fr: 'Livrée le',
            },
            icon: [, 'calendar'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    CUSTOMER_NAME: {
        custom: {
            path: 'customer.name',
            title: {
                en: 'Customer name',
                fr: 'Nom client',
            },
            icon: [, 'user'],
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const ORDER_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'cancel-order',
        icon: ['', 'close'],
        label: {
            en: 'Cancel the order',
            fr: 'Annuler la commande',
        },
        privilege: 'oms-v2.order.cancel',
        rules: {
            'order.cancelled_at': {
                equals: null,
            },
            'order.status': {
                not: {
                    equals: 'COMPLETED',
                },
            },
        },
        custom: {
            refresh: ['orderDetails', 'history'],
            request: {
                url: '{url}/orders/{order.id}/cancellation',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Cancel the order',
                    fr: 'Annuler la commande',
                },
                body: {
                    en: 'Are you sure you want to cancel that order?',
                    fr: 'Êtes-vous sûr de vouloir annuler cette commande?',
                },
                inputs: [
                    {
                        label: { en: 'Cancellation reason', fr: "Motif d'annulation" },
                        key: 'id',
                        type: 'select',
                        options: {
                            route: '{url}/cancellations/reasons?object[]=order&is_active=true',
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
                    en: 'The order has been successfully cancelled',
                    fr: 'La commande a bien été annulée',
                },
            },
        },
    },
    {
        name: 'confirm-order',
        icon: ['', 'check'],
        label: {
            en: 'Confirm the order',
            fr: 'Confirmer la commande',
        },
        rules: {
            'order.cancelled_at': {
                equals: null,
            },
            'order.status': {
                oneOf: ['CREATED', 'DRAFT'],
            },
        },
        privilege: 'oms-v2.order.transition',
        custom: {
            refresh: ['orderDetails', 'history'],
            request: {
                url: '{url}/orders/{order.id}',
                method: HTTPmethod.post,
                extra_payload: {
                    transition: 'to_confirm',
                },
            },
            content: {
                title: {
                    en: 'Confirm the order',
                    fr: 'Confirmer la commande',
                },
                body: {
                    en: 'Are you sure you want to confirm the order?',
                    fr: 'Êtes-vous sûr de vouloir confirmer cette commande ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The order has been successfully confirmed',
                    fr: 'La commande a bien été confirmée',
                },
            },
        },
    },
    {
        name: 'process-order',
        icon: ['', 'check'],
        label: {
            en: 'Processing by the supplier',
            fr: 'En cours de traitement par le fournisseur',
        },
        rules: {
            'order.cancelled_at': {
                equals: null,
            },
            'order.status': {
                equals: 'CONFIRMED',
            },
            'order.type': {
                equals: 'replenishment',
            },
        },
        privilege: 'oms-v2.order.transition',
        custom: {
            refresh: ['orderDetails', 'history'],
            request: {
                url: '{url}/orders/{order.id}',
                method: 'post',
                extra_payload: {
                    transition: 'to_processing',
                },
            },
            content: {
                title: {
                    en: 'Processing by the supplier',
                    fr: 'En cours de traitement par le fournisseur',
                },
                body: {
                    en: 'Are you sure you want to declare the order is processed by the supplier?',
                    fr: 'Êtes-vous sûr de vouloir déclarer que la commande est en cours de traitement ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The order has been successfully set as processing',
                    fr: 'La commande a bien été en cours de traitement',
                },
            },
        },
    },
    {
        name: 'complete-order',
        icon: ['', 'check'],
        label: {
            en: 'Complete the order',
            fr: 'Terminer la commande',
        },
        rules: {
            'order.cancelled_at': {
                equals: null,
            },
            'order.status': {
                equals: 'PROCESSING',
            },
            'order.type': {
                equals: 'replenishment',
            },
        },
        privilege: 'oms-v2.order.transition',
        custom: {
            refresh: ['orderDetails', 'history'],
            request: {
                url: '{url}/orders/{order.id}',
                method: 'post',
                extra_payload: {
                    transition: 'to_completed',
                },
            },
            content: {
                title: {
                    en: 'Complete the order',
                    fr: 'Terminer la commande',
                },
                body: {
                    en: 'Are you sure you want to complete the order?',
                    fr: 'Êtes-vous sûr de vouloir terminer cette commande ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The order has been successfully completed',
                    fr: 'La commande a bien été terminée',
                },
            },
        },
    },
    {
        name: 'create-return',
        icon: ['', 'order-return'],
        label: {
            en: 'Return items',
            fr: 'Retourner des articles',
        },
        privilege: 'oms-v2.return.create',
        rules: {
            'order.type': {
                oneOf: ['ship_from_store', 'bopis'],
            },
            'order.status': {
                not: {
                    oneOf: ['CREATED', 'CONFIRMED'],
                },
            },
        },
    },
    {
        name: 'edit-delivery-address',
        icon: ['', 'edit'],
        label: {
            en: 'Edit delivery address',
            fr: 'Modifier l’adresse de livraison',
        },
        privilege: 'oms-v2.order.update-shipment-address',
        rules: {
            'order.type': {
                oneOf: ['ship_from_store', 'bopis'],
            },
            'order.status': {
                not: {
                    equals: 'COMPLETED',
                },
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
    },
    {
        name: 'hand-over-the-order',
        label: {
            en: 'Hand over the order',
            fr: 'Remettre la commande',
        },
        privilege: 'oms-v2.order.transition',
        rules: {
            'order.cancelled_at': {
                equals: null,
            },
            'order.type': {
                equals: 'bopis',
            },
            'order.status': {
                equals: 'READY',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/orders/{order.id}',
                method: HTTPmethod.post,
                extra_payload: {
                    transition: 'complete',
                },
            },
            content: {
                title: {
                    en: 'Validate handing over of the order',
                    fr: 'Valider la remise de la commande',
                },
                body: {
                    en: 'Please enter the pickup code called by the customer',
                    fr: 'Veuillez entrer le code de retrait appelé par le client',
                },
                inputs: [
                    {
                        label: {
                            en: 'Code',
                            fr: 'Le code',
                        },
                        key: 'pickup_code',
                        type: 'string',
                        fallbackValue: null,
                        rules: [
                            {
                                required: true,
                                message: { en: 'Code field is mandatory', fr: 'Le code est obligatoire' },
                            },
                            {
                                pattern: new RegExp('\\b[0-9]{4}\\b'),
                                message: { en: 'Please enter 4 digits', fr: 'Entrez 4 chiffres' },
                            },
                        ],
                    },
                ],
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The order has been handed over to the customer',
                    fr: 'La commande a été remise au client',
                },
            },
            error_notifications: [
                {
                    title: {
                        en: 'Error',
                        fr: 'Erreur',
                    },
                    body: {
                        en: 'The pickup code is invalid',
                        fr: 'Le code de retrait est invalide',
                    },
                },
            ],
        },
    },
    {
        name: 'duplicate-replenishment-order',
        icon: ['', 'substitution'],
        label: {
            en: 'Duplicate the order',
            fr: 'Dupliquer la commande',
        },
        rules: {
            'order.type': {
                equals: 'replenishment',
            },
        },
        custom: {
            request: {
                redirection: '/{baseRoute}/orders/duplicate/{order.id}',
            },
        },
    },
    {
        name: 'edit-replenishment-order',
        icon: ['', 'edit'],
        label: {
            en: 'Edit the order',
            fr: 'Modifier la commande',
        },
        rules: {
            'order.type': {
                equals: 'replenishment',
            },
            'order.status': {
                equals: 'DRAFT',
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            request: {
                redirection: '/{baseRoute}/orders/edit/{order.id}',
            },
        },
    },
    {
        name: 'receive-order',
        icon: ['', 'order-income'],
        label: {
            en: 'Receive',
            fr: 'Réceptionner',
        },
        rules: {
            'order.type': {
                equals: 'replenishment',
            },
            'order.status': {
                oneOf: ['PROCESSING', 'CONFIRMED'],
            },
        },
    },
    {
        name: 'download-discrepancy-report',
        icon: ['', 'download'],
        type: 'download',
        label: {
            en: 'Download the discrepancy report',
            fr: "Télécharger le rapport d'écart",
        },
        custom: {
            refresh: ['orderDetails', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/orders/{order.id}/discrepancy-report/download ',
                method: 'get',
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
] as CustomActionConfiguration[];
