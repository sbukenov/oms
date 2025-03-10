import type { ColumnConfigBase } from '@bo/utils';

export const enum FulfillmentsTableDefaultColumns {
    REFERENCE = 'REFERENCE',
    OWNER = 'OWNER',
    STATUS = 'STATUS',
    CREATED_DATE = 'CREATED_DATE',
}

export type FulfillmentsTableColumn = ColumnConfigBase<keyof typeof FulfillmentsTableDefaultColumns>;
