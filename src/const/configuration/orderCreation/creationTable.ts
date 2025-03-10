import type { CreationTableColumn, CreationTableDefaultColumns } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__CREATION_LIST: CreationTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'REFERENCE' },
    { column: 'BOX_SIZE' },
    { column: 'PACKAGING_REF' },
    { column: 'OUTER' },
    { column: 'QUANTITY' },
    { column: 'TOTAL_OUTER' },
    { column: 'PRICE_PER_UNIT' },
    { column: 'UNIT_PRICE_EXCL_VAT' },
    { column: 'UNIT_PRICE_INCL_VAT' },
    { column: 'AMOUNT_EXCL_VAT' },
    { column: 'VAT_AMOUNT' },
    { column: 'AMOUNT_INCL_VAT' },
    { column: 'TRASH' },
];

export const CONFIG_COLUMN__CREATION_LIST: { [key in CreationTableDefaultColumns]?: CreationTableColumn } = {
    LABEL: {
        custom: {
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            path: ['product', 'label'],
            defaultValue: DEFAULT_DASH,
        },
    },
    REFERENCE: {
        custom: {
            title: {
                en: 'Product ref.',
                fr: 'Ref produit',
            },
            path: ['product', 'barcode'],
            defaultValue: DEFAULT_DASH,
        },
    },
    UNIT_PRICE_EXCL_VAT: {
        custom: {
            title: {
                en: 'Unit price Excl.Vat',
                fr: 'Prix HT',
            },
            path: 'unit_price_excluding_vat',
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    UNIT_PRICE_INCL_VAT: {
        custom: {
            title: {
                en: 'Unit price Incl.Vat',
                fr: 'Prix TTC',
            },
            path: 'unit_price_including_vat',
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    AMOUNT_EXCL_VAT: {
        custom: {
            title: {
                en: 'Amount excl.VAT',
                fr: 'Total HT',
            },
            path: 'amount_excluding_vat',
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    VAT_AMOUNT: {
        custom: {
            title: {
                en: 'VAT amount',
                fr: 'Total TVA',
            },
            path: 'vat_amount',
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    AMOUNT_INCL_VAT: {
        custom: {
            title: {
                en: 'Amount Incl.VAT',
                fr: 'Total TTC',
            },
            path: 'amount_including_vat',
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    BOX_SIZE: {
        custom: {
            title: {
                en: 'Box size',
                fr: 'Colisage',
            },
            path: ['selectedPackaging', 'label'],
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_REF: {
        custom: {
            title: {
                en: 'Packaging ref.',
                fr: 'Ref colisage',
            },
            path: ['selectedPackaging', 'reference'],
            defaultValue: DEFAULT_DASH,
        },
    },
    OUTER: {
        custom: {
            title: {
                en: 'Outer',
                fr: 'PCB',
            },
            path: ['selectedPackaging', 'product_per_packaging'],
            defaultValue: DEFAULT_DASH,
        },
    },
};
