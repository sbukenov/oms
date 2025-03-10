import type {
    OrderContentTableColumn,
    OrderContentTableDefaultColumns,
    OrderDefaultAmounts,
    OrderAmounts,
} from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__ORDER_DETAILS: OrderContentTableColumn[] = [
    { column: 'LABEL' },
    { column: 'QUANTITY' },
    { column: 'UNIT_PRICE_EXCL_VAT' },
    { column: 'UNIT_PRICE_INCL_VAT' },
    { column: 'AMOUNT_EXCL_VAT' },
    { column: 'VAT_RATE' },
    { column: 'VAT_AMOUNT' },
    { column: 'AMOUNT_INCL_VAT' },
];

export const CONFIG_COLUMN__ORDER_DETAILS: {
    [key in OrderContentTableDefaultColumns]?: OrderContentTableColumn;
} = {
    LABEL: {
        custom: {
            path: 'label',
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            defaultValue: DEFAULT_DASH,
            columnProps: { fixed: 'left' },
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
    VAT_RATE: {
        custom: {
            path: 'vat_rate',
            title: {
                en: 'VAT rate',
                fr: 'Taux TVA',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'percentage',
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

export const SHORT_CONFIG_AMOUNTS__ORDER_DETAILS: OrderAmounts[] = [
    { line: 'INITIAL_TOTAL_EXCL_VAT' },
    { line: 'INITIAL_TOTAL_VAT' },
    { line: 'INITIAL_TOTAL_INCL_VAT' },
    { line: 'FINAL_TOTAL_EXCL_VAT' },
    { line: 'FINAL_TOTAL_VAT' },
    { line: 'FINAL_TOTAL_INCL_VAT' },
];

export const CONFIG_AMOUNTS__ORDER_DETAILS: {
    [key in OrderDefaultAmounts]?: OrderAmounts;
} = {
    INITIAL_TOTAL_EXCL_VAT: {
        custom: {
            path: 'total_amounts.initial_total_amount_excluding_vat',
            title: {
                en: 'Initial total excl. VAT',
                fr: 'Total HT initial',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    INITIAL_TOTAL_VAT: {
        custom: {
            path: 'total_amounts.initial_total_vat_amount',
            title: {
                en: 'Initial total VAT',
                fr: 'Total TVA initial',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    INITIAL_TOTAL_INCL_VAT: {
        custom: {
            path: 'total_amounts.initial_total_amount_including_vat',
            title: {
                en: 'Initial total incl. VAT',
                fr: 'Total TTC initial',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    FINAL_TOTAL_EXCL_VAT: {
        custom: {
            path: 'total_amounts.final_total_amount_excluding_vat',
            title: {
                en: 'Final total excl. VAT',
                fr: 'Total HT final',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    FINAL_TOTAL_VAT: {
        custom: {
            path: 'total_amounts.final_total_vat_amount',
            title: {
                en: 'Final total VAT',
                fr: 'Total TVA final',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    FINAL_TOTAL_INCL_VAT: {
        custom: {
            path: 'total_amounts.final_total_amount_including_vat',
            title: {
                en: 'Final total incl. VAT',
                fr: 'Total TTC final',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
};
