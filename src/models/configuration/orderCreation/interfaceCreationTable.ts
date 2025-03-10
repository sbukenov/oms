import type { ColumnConfigBase } from '@bo/utils';

export const enum CreationTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    REFERENCE = 'REFERENCE',
    BOX_SIZE = 'BOX_SIZE',
    PACKAGING_REF = 'PACKAGING_REF',
    OUTER = 'OUTER',
    UNIT_PRICE_EXCL_VAT = 'UNIT_PRICE_EXCL_VAT',
    UNIT_PRICE_INCL_VAT = 'UNIT_PRICE_INCL_VAT',
    AMOUNT_EXCL_VAT = 'AMOUNT_EXCL_VAT',
    VAT_AMOUNT = 'VAT_AMOUNT',
    AMOUNT_INCL_VAT = 'AMOUNT_INCL_VAT',
    QUANTITY = 'QUANTITY',
    TOTAL_OUTER = 'TOTAL_OUTER',
    PRICE_PER_UNIT = 'PRICE_PER_UNIT',
    TRASH = 'TRASH',
}

export type CreationTableColumn = ColumnConfigBase<keyof typeof CreationTableDefaultColumns>;
