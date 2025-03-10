import { Owner } from '@bo/utils';

import type { ShipmentShort } from './InterfaceShipment';
import type { Customer } from './InterfaceCustomer';
import type { Price } from './InterfacePrice';
import type { FulfillmentStatusCodes, OrderStatusCodes } from './InterfaceStatusInfo';
import type {
    OrdersTableColumn,
    FulfillmentsTableColumn,
    ShipmentsTableColumn,
    ReturnsTableColumn,
    TransactionsTableColumn,
} from './configuration';

export type OrderTables =
    | OrdersTableColumn
    | FulfillmentsTableColumn
    | ShipmentsTableColumn
    | ReturnsTableColumn
    | TransactionsTableColumn;

export interface OrderLineSave {
    label?: string;
    product_pim_uuid?: string | null;
    type: string;
    reference?: string | null;
    quantity?: number;
    amount_excluding_vat?: Price;
    amount_including_vat?: Price;
    unit_price_excluding_vat?: Price;
    unit_price_including_vat?: Price;
    vat_amount?: Price;
    vat_rate?: Price;
    packaging: string | undefined;
}

export interface OrderSaveBody {
    type: string;
    currency: string;
    reference: string;
    owner: string;
    promised_delivery_date: string;
    order_lines: OrderLineSave[];
    shipping_address: {
        name: string;
        line_1: string;
        line_2: string | null;
        line_3: string | null;
        postal_code: string;
        country_code: string;
        city: string;
        email: string | null;
        phone: string | null;
        comment: string | null;
        type: string;
    };
    billing_address: {
        name: string;
        line_1: string;
        line_2: string | null;
        line_3: string | null;
        postal_code: string;
        country_code: string;
        city: string;
        email: string | null;
        phone: string | null;
        comment: string | null;
        type: string;
    };
    customer: {
        reference: string | null;
        name: string;
        type: string;
        account_id: string;
        email: string | null;
        phone_number: string | null;
    };
}

export const enum OrderType {
    bopis = 'bopis',
    ship_from_store = 'ship_from_store',
}

type Fulfillment = {
    id: string;
    status: FulfillmentStatusCodes;
    warning_count: number;
};

export type Order = {
    id: string;
    reference: string | null;
    currency: string;
    cancelled_at: string | null;
    total_amounts: {
        initial_total_before_taxes_and_discounts: {
            label: string;
            resulting_precision: number;
            total_amount: number;
        };
    };

    status: OrderStatusCodes;
    type: OrderType;

    shipment?: Partial<ShipmentShort>;
    payment: {
        status: null;
    };
    fulfillment?: Fulfillment;
    customer: Customer;

    created_at: string;
    updated_at: string;
    promised_delivery_date: string;
    owner: Owner;
    url: string;
};

export type OrderFilter = {
    [filter: string]: {
        url: string;
        isSelected?: boolean;
    };
};

export type OrdersData = {
    orders: Order[];
};

export type OrdersResponseData = OrdersData & {
    filters: OrderFilter;
};

export type OrderFull = Order & {
    order_lines: OrderLine[];
    shipping_address: ShippingAddress;
    billing_address: ShippingAddress;
    comments: OrderComment[];
};

export interface ShippingAddress {
    id: string;
    name: string;
    line_1: string;
    line_2: string;
    line_3: string;
    postal_code: string;
    country_code: string;
    city: string;
    email: string;
    phone: string;
    comment: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export type ShippingAddressFormData = Pick<
    ShippingAddress,
    | 'name'
    | 'city'
    | 'country_code'
    | 'email'
    | 'line_1'
    | 'line_2'
    | 'line_3'
    | 'phone'
    | 'type'
    | 'postal_code'
    | 'comment'
>;

export interface OrderLine {
    id: string;
    reference: string | null;
    image_url: string | null;
    status?: any;
    type?: any;
    unit_price: Price;
    unit_price_excluding_vat: Price;
    unit_price_including_vat: Price;
    amount_excluding_vat: Price;
    vat_amount: Price;
    amount_including_vat: Price;
    purchase_unit_price_excluding_vat: Price | null;
    purchase_amount_excluding_vat: Price | null;
    amount: Price;
    vat_rate: Price;
    quantity: number;
    label: string;
    created_at: string;
    updated_at: string;
    delivery_items_quantities: {
        returned: number;
        shipped: number;
        left_for_return: number;
        left_for_ship: number;
    };
    packaging: {
        id: string;
        product_per_packaging: number;
        product: {
            pim_uuid: string;
            label: string;
            barcode: string;
            image_url: string;
        };
    };
    owner: {
        id: string;
        label: string;
        url: string;
    };
}

export type OrderComment = {
    id: string;
    title: string;
    content: string | null;
    recipient: {
        id: string;
        label: string;
        url: string;
    } | null;
    created_at: string;
    updated_at: string;
    user: {
        first_name: string;
        id: string;
        last_name: string;
    };
};

export interface CommentForm {
    title: string;
    sender: string;
    content?: string;
    recipient?: string;
}

export type OrderCommentFormInputs = Pick<OrderComment, 'title' | 'content'>;

export type EditedComment = Pick<OrderComment, 'id' | 'title' | 'content'>;

export type AddCommentPayload = CommentForm & { onSuccess: () => void };

export type EditCommentPayload = OrderCommentFormInputs & { commentId: string; onSuccess: () => void };

export interface DeleteLinesBulkData {
    order_lines: string[];
}
export interface AddLinesBulkData {
    order_lines: OrderLineSave[];
}
export type EditLineData = {
    label: string;
    owner: string;
    vat_rate: Price;
    packaging: string;
    reference: string;
    quantity: number;
    amount_excluding_vat: Price;
    amount_including_vat: Price;
    unit_price_excluding_vat: Price;
    unit_price_including_vat: Price;
    vat_amount: Price;
};
