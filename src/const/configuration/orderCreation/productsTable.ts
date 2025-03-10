import type { ProductsTableColumn, ProductsTableDefaultColumns } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__PRODUCT_LIST: ProductsTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'REFERENCE' },
    { column: 'BOX_SIZE' },
    { column: 'PACKAGING_REF' },
    { column: 'OUTER' },
    { column: 'PRICE_PER_UNIT' },
    { column: 'MIN_QUANTITY' },
    { column: 'MIN_PRICE' },
];

export const CONFIG_COLUMN__PRODUCT_LIST: { [key in ProductsTableDefaultColumns]?: ProductsTableColumn } = {
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
};
