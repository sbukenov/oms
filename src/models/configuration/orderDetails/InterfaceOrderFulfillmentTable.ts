import type { ColumnConfigBase } from '@bo/utils';
import { LineConfigBase } from '@bo/utils';

export const enum OrderFulfillmentTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    STATUS = 'STATUS',
    ORDERED = 'ORDERED',
    PICKED = 'PICKED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    SUBSTITUTE = 'SUBSTITUTE',
    ACTION = 'ACTION',
}

export type OrderFulfillmentTableColumn = ColumnConfigBase<keyof typeof OrderFulfillmentTableDefaultColumns>;

export const enum FulfillmentAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    UPDATED_AT = 'UPDATED_AT',
}

export type FulfillmentAdditionalInfoLines = LineConfigBase<keyof typeof FulfillmentAdditionalInfoDefaultLines>;
