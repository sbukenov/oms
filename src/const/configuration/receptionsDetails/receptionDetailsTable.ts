import type {
    ReceptionDetailsAmounts,
    ReceptionDetailsTableColumn,
    ReceptionDetailsTableDefaultColumns,
    ReceptionDetailsDefaultAmounts,
} from '~/models';
import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__EXPEDITION_LIST: ReceptionDetailsTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'PRODUCT_LABEL' },
    { column: 'PRODUCT_BARCODE' },
    { column: 'PACKAGING_REF' },
    { column: 'PACKAGING_LABEL' },
    { column: 'OUTER' },
    { column: 'ORDERED' },
    { column: 'RECEIVED' },
    { column: 'DAMAGED' },
    { column: 'MISSING' },
    { column: 'UNIT_PRICE' },
    { column: 'TOTAL_AMOUNT' },
    { column: 'TOTAL_RECEIVED_AMOUNT' },
    { column: 'TRASH' },
];

export const CONFIG_COLUMN__EXPEDITION_LIST: {
    [key in ReceptionDetailsTableDefaultColumns]?: ReceptionDetailsTableColumn;
} = {
    PRODUCT_LABEL: {
        custom: {
            path: ['logistic_unit_items', '0', 'label'],
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PRODUCT_BARCODE: {
        custom: {
            path: ['logistic_unit_items', '0', 'barcode'],
            title: {
                en: 'Product EAN',
                fr: 'EAN produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_REF: {
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
    OUTER: {
        custom: {
            path: ['logistic_unit_items', '0', 'quantity'],
            title: {
                en: 'Outer',
                fr: 'PCB',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    ORDERED: {
        custom: {
            path: ['packaging', 'quantity'],
            title: {
                en: 'Ordered',
                fr: 'Commandé',
            },
            defaultValue: '0',
        },
    },
    TOTAL_AMOUNT: {
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

export const SHORT_CONFIG_AMOUNTS__RECEPTION_DETAILS: ReceptionDetailsAmounts[] = [
    { line: 'ORDERED' },
    { line: 'RECEIVED' },
    { line: 'DAMAGED' },
    { line: 'MISSING' },
    { line: 'TOTAL_AMOUNT' },
    { line: 'TOTAL_RECEIVED_AMOUNT' },
];

export const CONFIG_AMOUNTS__RECEPTION_DETAILS: {
    [key in ReceptionDetailsDefaultAmounts]?: ReceptionDetailsAmounts;
} = {
    ORDERED: {
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
    MISSING: {
        custom: {
            parentColumn: 'DID_NOT_RECEIVE',
            path: ['reception_state_recap', 'DID_NOT_RECEIVE'],
            title: {
                en: 'Missing',
                fr: 'Absent',
            },
        },
    },
    TOTAL_AMOUNT: {
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
    TOTAL_RECEIVED_AMOUNT: {
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
