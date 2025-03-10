import type { ColumnConfigBase } from '@bo/utils';

export const enum TransactionsTableDefaultColumns {
    REFERENCE = 'REFERENCE',
    ENTITY = 'ENTITY',
    TYPE = 'TYPE',
    STATUS = 'STATUS',
    CREATION_DATE = 'CREATION_DATE',
    AMOUNT_EXCL_VAT = 'AMOUNT_EXCL_VAT',
    AMOUNT_INCL_VAT = 'AMOUNT_INCL_VAT',
    AMOUNT = 'AMOUNT',
}

export type TransactionsTableColumn = ColumnConfigBase<keyof typeof TransactionsTableDefaultColumns>;
