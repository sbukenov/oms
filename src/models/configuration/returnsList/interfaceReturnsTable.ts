import type { ColumnConfigBase } from '@bo/utils';

export const enum ReturnsTableDefaultColumns {
    REFERENCE = 'REFERENCE',
    CUSTOMER = 'CUSTOMER',
    OWNER = 'OWNER',
    STATUS = 'STATUS',
    CREATED_DATE = 'CREATED_DATE',
}

export type ReturnsTableColumn = ColumnConfigBase<keyof typeof ReturnsTableDefaultColumns>;
