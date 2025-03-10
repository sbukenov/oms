import type { CustomActionConfiguration } from '@-bo/utils';

import type {
    OrderReceptionTableColumn,
    OrderReceptionTableDefaultColumns,
    ReceptionAdditionalInfoDefaultLines,
    ReceptionAdditionalInfoLines,
    ReceptionAmounts,
    ReceptionDefaultAmounts,
} from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__RECEPTION_DETAILS: OrderReceptionTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'BARCODE' },
    { column: 'REFERENCE' },
    { column: 'PACKAGING_LABEL' },
    { column: 'QUANTITY' },
    { column: 'PACKAGING_QUANTITY' },
    { column: 'RECEIVED' },
    { column: 'DAMAGED' },
    { column: 'DID_NOT_RECEIVE' },
    { column: 'INITIAL_TOTAL_AMOUNT' },
    { column: 'FINAL_TOTAL_AMOUNT' },
];

export const CONFIG_COLUMN__RECEPTION_DETAILS: {
    [key in OrderReceptionTableDefaultColumns]?: OrderReceptionTableColumn;
} = {
    LABEL: {
        custom: {
            path: ['logistic_unit_items', '0', 'label'],
            title: {
                en: 'Product',
                fr: 'Produit',
            },
        },
    },
    BARCODE: {
        custom: {
            path: ['logistic_unit_items', '0', 'barcode'],
            title: {
                en: 'Product EAN',
                fr: 'EAN produit',
            },
        },
    },
    REFERENCE: {
        custom: {
            path: ['packaging', 'reference'],
            title: {
                en: 'Packaging ref',
                fr: 'Ref colisage',
            },
        },
    },
    PACKAGING_LABEL: {
        custom: {
            path: ['packaging', 'label'],
            title: {
                en: 'Box size',
                fr: 'Colisage',
            },
        },
    },
    QUANTITY: {
        custom: {
            path: ['logistic_unit_items', '0', 'quantity'],
            title: {
                en: 'Outer',
                fr: 'PCB',
            },
        },
    },
    PACKAGING_QUANTITY: {
        custom: {
            path: ['packaging', 'quantity'],
            title: {
                en: 'Ordered',
                fr: 'Commandé',
            },
        },
    },
    RECEIVED: {
        custom: {
            path: ['packaging', 'reception_recap', 'RECEIVED'],
            title: {
                en: 'Received',
                fr: 'Reçu',
            },
        },
    },
    DAMAGED: {
        custom: {
            path: ['packaging', 'reception_recap', 'DAMAGED'],
            title: {
                en: 'Damaged',
                fr: 'Endommagé',
            },
        },
    },
    DID_NOT_RECEIVE: {
        custom: {
            path: ['packaging', 'reception_recap', 'DID_NOT_RECEIVE'],
            title: {
                en: 'Missing',
                fr: 'Absent',
            },
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
    FINAL_TOTAL_AMOUNT: {
        custom: {
            path: 'final_total_amount',
            title: {
                en: 'Total received amount',
                fr: 'Montant total reçu',
            },
            format: 'price',
        },
    },
};

export const SHORT_CONFIG_LINES__RECEPTION_ADDITIONAL_INFO: ReceptionAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'CREATED_BY' },
];

export const CONFIG_LINES__RECEPTION_ADDITIONAL_INFO: {
    [key in ReceptionAdditionalInfoDefaultLines]?: ReceptionAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Créée le',
            },
            path: ['reception', 'created_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const SHORT_CONFIG_AMOUNTS__RECEPTION: ReceptionAmounts[] = [
    { line: 'PACKAGING_QUANTITY' },
    { line: 'RECEIVED' },
    { line: 'DAMAGED' },
    { line: 'DID_NOT_RECEIVE' },
    { line: 'INITIAL_TOTAL_AMOUNT' },
    { line: 'FINAL_TOTAL_AMOUNT' },
];

export const CONFIG_AMOUNTS__RECEPTION: {
    [key in ReceptionDefaultAmounts]?: ReceptionAmounts;
} = {
    PACKAGING_QUANTITY: {
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
    RECEIVED: {
        custom: {
            parentColumn: 'RECEIVED',
            path: ['reception_state_recap', 'RECEIVED'],
            title: {
                en: 'Received',
                fr: 'Reçu',
            },
        },
    },
    DAMAGED: {
        custom: {
            parentColumn: 'DAMAGED',
            path: ['reception_state_recap', 'DAMAGED'],
            title: {
                en: 'Damaged',
                fr: 'Endommagé',
            },
        },
    },
    DID_NOT_RECEIVE: {
        custom: {
            parentColumn: 'DID_NOT_RECEIVE',
            path: ['reception_state_recap', 'DID_NOT_RECEIVE'],
            title: {
                en: 'Missing',
                fr: 'Absent',
            },
        },
    },
    INITIAL_TOTAL_AMOUNT: {
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
    FINAL_TOTAL_AMOUNT: {
        custom: {
            parentColumn: 'FINAL_TOTAL_AMOUNT',
            path: 'final_total_amount',
            title: {
                en: 'Total received amount',
                fr: 'Montant total reçu',
            },
            format: 'price',
        },
    },
};

export const RECEPTION_ACTIONS = [
    {
        name: 'validate-reception',
        icon: ['', 'check'],
        label: {
            en: 'Validate the reception',
            fr: 'Valider la réception',
        },
        rules: {
            'reception.status': {
                equals: 'AWAITING_RECEPTION',
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReceptions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{reception.id}',
                method: 'post',
                extra_payload: { transition: 'receive' },
            },
            content: {
                title: {
                    en: 'Validate the reception',
                    fr: 'Valider la réception',
                },
                body: {
                    en: 'Are you sure you want to validate the reception?',
                    fr: 'Êtes-vous sûr de vouloir valider la réception ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Reception has been validated',
                    fr: 'La réception a été validée',
                },
            },
        },
    },
    {
        name: 'finalize-reception',
        icon: ['', 'check'],
        label: {
            en: 'Finalize the reception',
            fr: 'Finaliser la réception',
        },
        rules: {
            'reception.status': {
                equals: 'RECEIVING',
            },
            'order.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReceptions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{reception.id}',
                method: 'post',
                extra_payload: { transition: 'complete' },
            },
            content: {
                title: {
                    en: 'Finalize the reception',
                    fr: 'Finaliser la réception',
                },
                body: {
                    en: 'Are you sure you want to finalize the reception?',
                    fr: 'Êtes-vous sûr de vouloir finaliser la réception ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Reception has been finalized',
                    fr: 'La réception a été finalisée',
                },
            },
        },
    },
    {
        name: 'refuse-reception',
        icon: ['', 'close'],
        label: {
            en: 'Refuse the reception',
            fr: 'Refuser la réception',
        },
        rules: {
            'reception.status': {
                oneOf: ['AWAITING_RECEPTION', 'RECEIVING'],
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReceptions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{reception.id}',
                method: 'post',
                extra_payload: { transition: 'refuse' },
            },
            content: {
                title: {
                    en: 'Refuse the reception',
                    fr: 'Refuser la réception',
                },
                body: {
                    en: 'Are you sure you want to refuse the reception?',
                    fr: 'Êtes-vous sûr de vouloir refuser la réception ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Reception has been refused',
                    fr: 'La réception a été refusée',
                },
            },
        },
    },
    {
        name: 'download-reception-note',
        icon: ['', 'download'],
        type: 'download',
        label: {
            en: 'Download the reception note',
            fr: 'Télécharger le bon de réception',
        },
        custom: {
            refresh: ['orderDetails', 'orderReceptions', 'history'],
            request: {
                url: '{url}/stock-operation/replenishment-operation/{reception.id}/reception/download ',
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
