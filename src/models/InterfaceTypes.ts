export interface Types {
    Fulfillment: FulfillmentTypesV2[];
    Order: OrderTypesV2[];
    OrderLine: OrderLineTypesV2[];
    OrderReturn: OrderReturnTypesV2[];
    Shipment: ShipmentTypesV2[];
    Transaction: TransactionTypesV2[];
}

export const enum OrderTypesV2 {
    ship_from_store = 'ship_from_store',
    bopis = 'bopis',
}
export const enum FulfillmentTypesV2 {
    simple_preparation = 'simple_preparation',
    complex_preparation = 'complex_preparation',
}
export const enum OrderLineTypesV2 {
    item_line = 'item_line',
    tax_item_line = 'tax_item_line',
    tax_line = 'tax_line',
    discount_line = 'discount_line',
    discount_item_line = 'discount_item_line',
    cancel_item_line = 'cancel_item_line',
    cancel_tax_item_line = 'cancel_tax_item_line',
    cancel_tax_line = 'cancel_tax_line',
    cancel_discount_line = 'cancel_discount_line',
    cancel_discount_item_line = 'cancel_discount_item_line',
}
export const enum OrderReturnTypesV2 {
    default = 'default',
}
export const enum ShipmentTypesV2 {
    direct_delivery = 'direct_delivery',
}
export const enum TransactionTypesV2 {
    refund = 'refund',
    sale = 'sale',
}
