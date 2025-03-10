import type { LineConfigBase } from '@bo/utils';

export const enum OrderDetailsPanelDefaultLines {
    TYPE = 'TYPE',
    DELIVERY_DATE = 'DELIVERY_DATE',
    DELIVERY_AT = 'DELIVERY_AT',
    CUSTOMER_NAME = 'CUSTOMER_NAME',
    ADDRESS = 'ADDRESS',
}

export type OrderDetailsPanelLines = LineConfigBase<keyof typeof OrderDetailsPanelDefaultLines>;
