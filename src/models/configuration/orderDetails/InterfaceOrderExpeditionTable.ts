import type { ColumnConfigBase, LineConfigBase } from '@bo/utils';

export const enum OrderExpeditionTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    BARCODE = 'BARCODE',
    REFERENCE = 'REFERENCE',
    PACKAGING_LABEL = 'PACKAGING_LABEL',
    QUANTITY = 'QUANTITY',
    PACKAGING_QUANTITY = 'PACKAGING_QUANTITY',
    INITIAL_TOTAL_AMOUNT = 'INITIAL_TOTAL_AMOUNT',
}

export type OrderExpeditionTableColumn = ColumnConfigBase<keyof typeof OrderExpeditionTableDefaultColumns>;

export const enum ExpeditionAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    CREATED_BY = 'CREATED_BY',
}

export type ExpeditionAdditionalInfoLines = LineConfigBase<keyof typeof ExpeditionAdditionalInfoDefaultLines>;

export const enum ExpeditionDefaultAmounts {
    PACKAGING_QUANTITY_TOTAL = 'PACKAGING_QUANTITY_TOTAL',
    INITIAL_AMOUNT_TOTAL = 'INITIAL_AMOUNT_TOTAL',
}

export type ExpeditionAmounts = LineConfigBase<keyof typeof ExpeditionDefaultAmounts>;
