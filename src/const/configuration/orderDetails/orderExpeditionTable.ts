import type { CustomActionConfiguration } from '@-bo/utils';

import type {
    OrderExpeditionTableColumn,
    OrderExpeditionTableDefaultColumns,
    ExpeditionAdditionalInfoDefaultLines,
    ExpeditionAdditionalInfoLines,
    ExpeditionAmounts,
    ExpeditionDefaultAmounts,
} from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__EXPEDITION_DETAILS: OrderExpeditionTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'BARCODE' },
    { column: 'REFERENCE' },
    { column: 'PACKAGING_LABEL' },
    { column: 'QUANTITY' },
    { column: 'PACKAGING_QUANTITY' },
    { column: 'INITIAL_TOTAL_AMOUNT' },
];

export const CONFIG_COLUMN__EXPEDITION_DETAILS: {
    [key in OrderExpeditionTableDefaultColumns]?: OrderExpeditionTableColumn;
} = {
    LABEL: {
        custom: {
            path: ['logistic_unit_items', '0', 'label'],
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    BARCODE: {
        custom: {
            path: ['logistic_unit_items', '0', 'barcode'],
            title: {
                en: 'Product EAN',
                fr: 'EAN produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    REFERENCE: {
        custom: {
            path: ['packaging', 'reference'],
            title: {
                en: 'Packaging ref',
                fr: 'Ref colisage',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_LABEL: {
        custom: {
            path: ['packaging', 'label'],
            title: {
                en: 'Box size',
                fr: 'Colisage',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    QUANTITY: {
        custom: {
            path: ['logistic_unit_items', '0', 'quantity'],
            title: {
                en: 'Outer',
                fr: 'PCB',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_QUANTITY: {
        custom: {
            path: ['packaging', 'quantity'],
            title: {
                en: 'Ordered',
                fr: 'Commandé',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    INITIAL_TOTAL_AMOUNT: {
        custom: {
            path: 'initial_total_amount',
            title: {
                en: 'Total amount',
                fr: 'Montant total',
            },
            format: 'price',
        },
    },
};

export const SHORT_CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO: ExpeditionAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'CREATED_BY' },
];

export const CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO: {
    [key in ExpeditionAdditionalInfoDefaultLines]?: ExpeditionAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Créée le',
            },
            path: ['expedition', 'created_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const SHORT_CONFIG_AMOUNTS__EXPEDITION: ExpeditionAmounts[] = [
    { line: 'PACKAGING_QUANTITY_TOTAL' },
    { line: 'INITIAL_AMOUNT_TOTAL' },
];

export const CONFIG_AMOUNTS__EXPEDITION: {
    [key in ExpeditionDefaultAmounts]?: ExpeditionAmounts;
} = {
    PACKAGING_QUANTITY_TOTAL: {
        custom: {
            parentColumn: 'PACKAGING_QUANTITY',
            path: ['reception_state_recap', 'ORDERED'],
            title: {
                en: 'Ordered',
                fr: 'Commandé',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    INITIAL_AMOUNT_TOTAL: {
        custom: {
            parentColumn: 'INITIAL_TOTAL_AMOUNT',
            path: 'initial_total_amount',
            title: {
                en: 'Total amount',
                fr: 'Montant total',
            },
            format: 'price',
        },
    },
};

export const EXPEDITION_ACTIONS = [
    {
        name: 'handover-expedition',
        icon: ['', 'check'],
        label: {
            en: 'Hand over the expedition to the shipper',
            fr: "Remettre l'expédition au transporteur",
        },
        rules: {
            'expedition.status': {
                equals: 'AWAITING_RECEPTION',
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderExpeditions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{expedition.id}',
                method: 'post',
                extra_payload: { transition: 'receive' },
            },
            content: {
                title: {
                    en: 'Hand over the expedition to the shipper',
                    fr: "Remettre l'expédition au transporteur",
                },
                body: {
                    en: 'Are you sure you want to hand over the expedition to the shipper?',
                    fr: "Êtes-vous sûr de vouloir remettre l'expédition au transporteur ?",
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Expedition has been handed over to the shipper',
                    fr: "L'expédition a été remise à l'expéditeur",
                },
            },
        },
    },
    {
        name: 'deliver-expedition',
        icon: ['', 'check'],
        label: {
            en: 'Deliver the expedition',
            fr: "Livrer l'expédition",
        },
        rules: {
            'expedition.status': {
                equals: 'RECEIVING',
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderExpeditions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{expedition.id}',
                method: 'post',
                extra_payload: { transition: 'complete' },
            },
            content: {
                title: {
                    en: 'Deliver the expedition',
                    fr: "Livrer l'expédition",
                },
                body: {
                    en: 'Are you sure you want to confirm expedition delivery to the store?',
                    fr: "Êtes-vous sûr de vouloir confirmer la livraison de l'expédition au magasin ?",
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Expedition has been delivered to the store',
                    fr: "L'expédition a été livrée au magasin",
                },
            },
        },
    },
    {
        name: 'refuse-expedition',
        icon: ['', 'close'],
        label: {
            en: 'Refuse the expedition',
            fr: "Refuser l'expédition",
        },
        rules: {
            'expedition.status': {
                oneOf: ['AWAITING_RECEPTION', 'RECEIVING'],
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderExpeditions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{expedition.id}',
                method: 'post',
                extra_payload: { transition: 'refuse' },
            },
            content: {
                title: {
                    en: 'Refuse the expedition',
                    fr: "Refuser l'expédition",
                },
                body: {
                    en: 'Are you sure you want to refuse the expedition?',
                    fr: "Êtes-vous sûr de vouloir refuser l'expédition ?",
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Expedition has been refused',
                    fr: "L'expédition a été refusée",
                },
            },
        },
    },
    {
        name: 'upload-delivery-note',
        type: 'upload',
        icon: ['', 'upload'],
        label: {
            en: 'Upload delivery note',
            fr: 'Télécharger un bon de livraison',
        },
        custom: {
            refresh: ['orderDetails', 'orderExpeditions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{expedition.id}/attachment/upload',
                method: 'post',
            },
            content: {
                title: {
                    en: 'Upload delivery note',
                    fr: 'Télécharger un bon de livraison',
                },
                body: {
                    en: 'Please upload a file in one of the following formats: .jpg, .png, .pdf. The maximum size should not exceed 4 Mb.',
                    fr: 'Téléchargez un fichier dans un des formats suivants: .jpg, .png, .pdf. La taille maximum est limitée de 4 Mo.',
                },
                confirm: {
                    text: {
                        en: 'Upload',
                        fr: 'Télécharger',
                    },
                    icon: 'download',
                },
            },
            success_notification: {
                title: {
                    en: 'Uploaded successfully',
                    fr: 'Téléchargement réussi',
                },
                body: {
                    en: 'Delivery note has been added',
                    fr: 'Le bon de livraison a été ajouté',
                },
            },
        },
    },
] as CustomActionConfiguration[];
