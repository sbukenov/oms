import type { ColumnConfigBase, LineConfigBase } from '@bo/utils';

export const enum OrderTransactionTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    QUANTITY = 'QUANTITY',
    UNIT_PRICE_EXCL_VAT = 'UNIT_PRICE_EXCL_VAT',
    UNIT_PRICE_INCL_VAT = 'UNIT_PRICE_INCL_VAT',
    AMOUNT_EXCL_VAT = 'AMOUNT_EXCL_VAT',
    AMOUNT_INCL_VAT = 'AMOUNT_INCL_VAT',
    AMOUNT = 'AMOUNT',
    ACTION = 'ACTION',
}

export type OrderTransactionTableColumn = ColumnConfigBase<keyof typeof OrderTransactionTableDefaultColumns>;

export const enum OrderTransactionDefaultAmounts {
    TOTAL_AMOUNT_EXCL_VAT = 'TOTAL_AMOUNT_EXCL_VAT',
    TOTAL_VAT = 'TOTAL_VAT',
    TOTAL_AMOUNT_INCL_VAT = 'TOTAL_AMOUNT_INCL_VAT',
}

export type OrderTransactionAmounts = LineConfigBase<keyof typeof OrderTransactionDefaultAmounts>;

export const enum TransactionAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    UPDATED_AT = 'UPDATED_AT',
}

export type TransactionAdditionalInfoLines = LineConfigBase<keyof typeof TransactionAdditionalInfoDefaultLines>;
