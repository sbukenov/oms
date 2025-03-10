import { ColumnConfigBase } from '@bo/utils';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN_ORDER_LINES_LIST: ColumnConfigBase<any>[] = [
    { column: 'IMAGE' },
    { column: 'PRODUCT_LABEL' },
    { column: 'PRODUCT_BARCODE' },
    { column: 'PACKAGING_LABEL' },
    { column: 'LABEL' },
    { column: 'OUTER' },
    { column: 'QUANTITY' },
    { column: 'UNIT_PRICE' },
    { column: 'TOTAL_OUTER' },
    { column: 'TRASH' },
];

export const CONFIG_COLUMN_ORDER_LINES_LIST = {
    PRODUCT_LABEL: {
        custom: {
            path: ['packaging', 'product', 'label'],
            title: { en: 'Product', fr: 'Produit' },
            defaultValue: DEFAULT_DASH,
        },
    },
    PRODUCT_BARCODE: {
        custom: {
            path: ['packaging', 'product', 'barcode'],
            title: { en: 'Barcode', fr: 'Code barre' },
            defaultValue: DEFAULT_DASH,
        },
    },
    PACKAGING_LABEL: {
        custom: {
            path: ['packaging', 'label'],
            title: { en: 'Packaging ref.', fr: 'Ref. Colisage' },
            defaultValue: DEFAULT_DASH,
        },
    },
    LABEL: {
        custom: {
            path: 'label',
            title: { en: 'Box size', fr: 'Colisage' },
            defaultValue: DEFAULT_DASH,
        },
    },
    OUTER: {
        custom: {
            path: ['packaging', 'product_per_packaging'],
            title: { en: 'Outer', fr: 'PCB' },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
};
