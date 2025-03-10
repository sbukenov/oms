import type { ColumnConfigBase } from '@bo/utils';

export const enum ShipmentsTableDefaultColumns {
    REFERENCE = 'REFERENCE',
    ENTITY = 'ENTITY',
    STATUS = 'STATUS',
    CREATION_DATE = 'CREATION_DATE',
    DELIVERY_DATE = 'DELIVERY_DATE',
    TRACKING_LINK = 'TRACKING_LINK',
}

export type ShipmentsTableColumn = ColumnConfigBase<keyof typeof ShipmentsTableDefaultColumns>;
