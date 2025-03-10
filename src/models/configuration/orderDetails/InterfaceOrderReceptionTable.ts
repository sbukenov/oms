import type { ColumnConfigBase } from '@bo/utils';
import { LineConfigBase } from '@bo/utils';

export const enum OrderReceptionTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    BARCODE = 'BARCODE',
    REFERENCE = 'REFERENCE',
    PACKAGING_LABEL = 'PACKAGING_LABEL',
    QUANTITY = 'QUANTITY',
    PACKAGING_QUANTITY = 'PACKAGING_QUANTITY',
    RECEIVED = 'RECEIVED',
    DAMAGED = 'DAMAGED',
    DID_NOT_RECEIVE = 'DID_NOT_RECEIVE',
    INITIAL_TOTAL_AMOUNT = 'INITIAL_TOTAL_AMOUNT',
    FINAL_TOTAL_AMOUNT = 'FINAL_TOTAL_AMOUNT',
}

export type OrderReceptionTableColumn = ColumnConfigBase<keyof typeof OrderReceptionTableDefaultColumns>;

export const enum ReceptionAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    CREATED_BY = 'CREATED_BY',
}

export type ReceptionAdditionalInfoLines = LineConfigBase<keyof typeof ReceptionAdditionalInfoDefaultLines>;

export const enum ReceptionDefaultAmounts {
    PACKAGING_QUANTITY = 'PACKAGING_QUANTITY',
    RECEIVED = 'RECEIVED',
    DAMAGED = 'DAMAGED',
    DID_NOT_RECEIVE = 'DID_NOT_RECEIVE',
    INITIAL_TOTAL_AMOUNT = 'INITIAL_TOTAL_AMOUNT',
    FINAL_TOTAL_AMOUNT = 'FINAL_TOTAL_AMOUNT',
}

export type ReceptionAmounts = LineConfigBase<keyof typeof ReceptionDefaultAmounts>;
