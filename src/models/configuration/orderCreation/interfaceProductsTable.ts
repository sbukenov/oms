import type { ColumnConfigBase } from '@bo/utils';

export const enum ProductsTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    REFERENCE = 'REFERENCE',
    BOX_SIZE = 'BOX_SIZE',
    PACKAGING_REF = 'PACKAGING_REF',
    OUTER = 'OUTER',
    PRICE_PER_UNIT = 'PRICE_PER_UNIT',
    MIN_QUANTITY = 'MIN_QUANTITY',
    MIN_PRICE = 'MIN_PRICE',
}

export type ProductsTableColumn = ColumnConfigBase<keyof typeof ProductsTableDefaultColumns>;
