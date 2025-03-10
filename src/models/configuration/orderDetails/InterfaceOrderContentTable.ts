import type { ColumnConfigBase, LineConfigBase } from '@bo/utils';

export const enum OrderReplenishmentTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    PRODUCT_REF = 'PRODUCT_REF',
    PACKAGING_REF = 'PACKAGING_REF',
    BOX_SIZE = 'BOX_SIZE',
    OUTER = 'OUTER',
    UNIT_PRICE_EXCL_VAT = 'UNIT_PRICE_EXCL_VAT',
    UNIT_PRICE_INCL_VAT = 'UNIT_PRICE_INCL_VAT',
    QUANTITY = 'QUANTITY',
    TOTAL_OUTER = 'TOTAL_OUTER',
    AMOUNT_EXCL_VAT = 'AMOUNT_EXCL_VAT',
    VAT_AMOUNT = 'VAT_AMOUNT',
    AMOUNT_INCL_VAT = 'AMOUNT_INCL_VAT',
}

export type OrderReplenishmentTableColumn = ColumnConfigBase<keyof typeof OrderReplenishmentTableDefaultColumns>;

export const enum OrderContentTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    QUANTITY = 'QUANTITY',
    UNIT_PRICE_EXCL_VAT = 'UNIT_PRICE_EXCL_VAT',
    UNIT_PRICE_INCL_VAT = 'UNIT_PRICE_INCL_VAT',
    AMOUNT_EXCL_VAT = 'AMOUNT_EXCL_VAT',
    VAT_RATE = 'VAT_RATE',
    VAT_AMOUNT = 'VAT_AMOUNT',
    AMOUNT_INCL_VAT = 'AMOUNT_INCL_VAT',
    ACTION = 'ACTION',
}

export type OrderContentTableColumn = ColumnConfigBase<keyof typeof OrderContentTableDefaultColumns>;

export const enum OrderDefaultAmounts {
    INITIAL_TOTAL_EXCL_VAT = 'INITIAL_TOTAL_EXCL_VAT',
    INITIAL_TOTAL_VAT = 'INITIAL_TOTAL_VAT',
    INITIAL_TOTAL_INCL_VAT = 'INITIAL_TOTAL_INCL_VAT',
    FINAL_TOTAL_EXCL_VAT = 'FINAL_TOTAL_EXCL_VAT',
    FINAL_TOTAL_VAT = 'FINAL_TOTAL_VAT',
    FINAL_TOTAL_INCL_VAT = 'FINAL_TOTAL_INCL_VAT',
}

export type OrderAmounts = LineConfigBase<keyof typeof OrderDefaultAmounts>;
