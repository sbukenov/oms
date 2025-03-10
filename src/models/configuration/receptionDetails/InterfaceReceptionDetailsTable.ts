import type { ColumnConfigBase, LineConfigBase } from '@bo/utils';

export const enum ReceptionDetailsTableDefaultColumns {
    IMAGE = 'IMAGE',
    PRODUCT_LABEL = 'PRODUCT_LABEL',
    PRODUCT_BARCODE = 'PRODUCT_BARCODE',
    PACKAGING_REF = 'PACKAGING_REF',
    PACKAGING_LABEL = 'PACKAGING_LABEL',
    OUTER = 'OUTER',
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
    DAMAGED = 'DAMAGED',
    MISSING = 'MISSING',
    UNIT_PRICE = 'UNIT_PRICE',
    TOTAL_AMOUNT = 'TOTAL_AMOUNT',
    TOTAL_RECEIVED_AMOUNT = 'TOTAL_RECEIVED_AMOUNT',
    TRASH = 'TRASH',
}

export type ReceptionDetailsTableColumn = ColumnConfigBase<keyof typeof ReceptionDetailsTableDefaultColumns>;

export const enum ReceptionDetailsDefaultAmounts {
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
    DAMAGED = 'DAMAGED',
    MISSING = 'MISSING',
    TOTAL_AMOUNT = 'TOTAL_AMOUNT',
    TOTAL_RECEIVED_AMOUNT = 'TOTAL_RECEIVED_AMOUNT',
}

export type ReceptionDetailsAmounts = LineConfigBase<keyof typeof ReceptionDetailsDefaultAmounts>;
