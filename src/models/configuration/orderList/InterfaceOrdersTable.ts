import type { ColumnConfigBase } from '@bo/utils';

export const enum OrdersTableDefaultColumns {
    REFERENCE = 'REFERENCE',
    CUSTOMER = 'CUSTOMER',
    OWNER = 'OWNER',
    STATUS = 'STATUS',
    FULFILLMENT_STATUS = 'FULFILLMENT_STATUS',
    SHIPMENT_STATUS = 'SHIPMENT_STATUS',
    CREATED_DATE = 'CREATED_DATE',
    DELIVERY_DATE = 'DELIVERY_DATE',
    AMOUNT = 'AMOUNT',
    PROMISED_DELIVERY_DATE = 'PROMISED_DELIVERY_DATE',
    SUPPLIER = 'SUPPLIER',
    INITIAL_TOTAL_AMOUNT_INCLUDING_VAT = 'INITIAL_TOTAL_AMOUNT_INCLUDING_VAT',
}

export type OrdersTableColumn = ColumnConfigBase<keyof typeof OrdersTableDefaultColumns>;
