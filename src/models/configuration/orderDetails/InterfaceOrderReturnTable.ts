import type { ColumnConfigBase, LineConfigBase } from '@bo/utils';

export const enum OrderReturnTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    EAN = 'EAN',
    STATUS = 'STATUS',
    QUANTITY = 'QUANTITY',
    REASON = 'REASON',
    ACTION = 'ACTION',
}

export type OrderReturnTableColumn = ColumnConfigBase<keyof typeof OrderReturnTableDefaultColumns>;

export const enum ReturnAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    UPDATED_AT = 'UPDATED_AT',
    REASON = 'REASON',
}

export type ReturnAdditionalInfoLines = LineConfigBase<keyof typeof ReturnAdditionalInfoDefaultLines>;
