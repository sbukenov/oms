import type { OrderReplenishmentTableColumn, OrderReplenishmentTableDefaultColumns } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__REPLENISHMENT_DETAILS: OrderReplenishmentTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'PRODUCT_REF' },
    { column: 'PACKAGING_REF' },
    { column: 'BOX_SIZE' },
    { column: 'OUTER' },
    { column: 'UNIT_PRICE_EXCL_VAT' },
    { column: 'UNIT_PRICE_INCL_VAT' },
    { column: 'QUANTITY' },
    { column: 'TOTAL_OUTER' },
    { column: 'AMOUNT_EXCL_VAT' },
    { column: 'VAT_AMOUNT' },
    { column: 'AMOUNT_INCL_VAT' },
];

export const CONFIG_COLUMN__REPLENISHMENT_DETAILS: {
    [key in OrderReplenishmentTableDefaultColumns]?: OrderReplenishmentTableColumn;
} = {
    LABEL: {
        custom: {
            path: ['packaging', 'product', 'label'],
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: { fixed: 'left' },
        },
    },
    BOX_SIZE: {
        custom: {
            path: 'label',
            title: {
                en: 'Box size',
                fr: 'Colisage',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PRODUCT_REF: {
        custom: {
            path: ['packaging', 'product', 'barcode'],
            title: {
                en: 'Product ref.',
                fr: 'Ref. Produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_REF: {
        custom: {
            path: 'reference',
            title: {
                en: 'Packaging ref.',
                fr: 'Ref. Colisage',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    OUTER: {
        custom: {
            path: ['packaging', 'product_per_packaging'],
            title: {
                en: 'Outer',
                fr: 'PCB',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    QUANTITY: {
        custom: {
            path: 'quantity',
            title: {
                en: 'Quantity',
                fr: 'Quantité',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    UNIT_PRICE_EXCL_VAT: {
        custom: {
            path: 'unit_price_excluding_vat',
            title: {
                en: 'Unit price Excl.VAT',
                fr: 'Prix unitaire HT',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    UNIT_PRICE_INCL_VAT: {
        custom: {
            path: 'unit_price_including_vat',
            title: {
                en: 'Unit price Incl.VAT',
                fr: 'Prix unitaire TTC',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    AMOUNT_EXCL_VAT: {
        custom: {
            path: 'amount_excluding_vat',
            title: {
                en: 'Amount Excl.VAT',
                fr: 'Total HT',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    VAT_AMOUNT: {
        custom: {
            path: 'vat_amount',
            title: {
                en: 'VAT amount',
                fr: 'Total TVA',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    AMOUNT_INCL_VAT: {
        custom: {
            path: 'amount_including_vat',
            title: {
                en: 'Amount Incl.VAT',
                fr: 'Total TTC',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
};
