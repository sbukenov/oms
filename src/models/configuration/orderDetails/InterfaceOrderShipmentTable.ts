import type { ColumnConfigBase } from '@-bo/utils';
import { LineConfigBase } from '@-bo/utils';

export const enum OrderShipmentTableDefaultColumns {
    IMAGE = 'IMAGE',
    LABEL = 'LABEL',
    REFERENCE = 'REFERENCE',
    QUANTITY = 'QUANTITY',
    ACTION = 'ACTION',
}

export type OrderShipmentTableColumn = ColumnConfigBase<keyof typeof OrderShipmentTableDefaultColumns>;

export const enum ShipmentAdditionalInfoDefaultLines {
    CREATED_AT = 'CREATED_AT',
    UPDATED_AT = 'UPDATED_AT',
    EXPECTED_AT = 'EXPECTED_AT',
}

export type ShipmentAdditionalInfoLines = LineConfigBase<keyof typeof ShipmentAdditionalInfoDefaultLines>;
