import { Price, Owner, Headers } from '@bo/utils';

import { Customer } from './InterfaceCustomer';
import { Address } from './InterfaceShipment';
import { TransactionStatusCodes } from './InterfaceStatusInfo';
import { Amount, AmountWithLabel } from './InterfaceAmount';

export interface OrderTransactions {
    items?: Transaction[];
    order?: {
        id: string | undefined;
        merchant_ref?: string | null;
        customer?: Partial<Customer>;
        shipping_address?: Partial<Address>;
        billing_address?: Partial<Address>;
        url?: string;
    };
}

export interface Transaction {
    id: string;
    reference: string | null;
    type: TransactionType;
    status: TransactionStatusCodes;
    owner: Owner;
    return: TransactionReturn | null;
    lines: TransactionLine[];
    created_at: string;
    updated_at: string | null;
    cancelled_at: string | null;
    fees: TransactionFee[];
    total_amounts: Record<
        'total_amount_including_vat' | 'total_amount_excluding_vat' | 'total_vat' | string,
        AmountWithLabel
    >;
    currency: string;
}

export interface TransactionLine {
    id: string;
    order_line: {
        id: string;
        image_url: string | null;
    };
    reference: string | null;
    label: string;
    quantity: number;
    amount_including_vat: Amount;
    amount_excluding_vat: Amount;
    unit_price_including_vat: Amount;
    unit_price_excluding_vat: Amount;
    vat_amount: Amount;
    type: string;
    owner: Owner;
    delivery_items_quantities: {
        shipped: number;
        returned: number;
    };
    fulfilled_items_quantities: {
        picked: number;
        out_of_stock: number;
        substitute: number;
    };
}

export interface TransactionFee {
    id: string;
    label: string;
    amount: Amount;
    isFee?: boolean;
}

export const enum TransactionType {
    refund = 'refund',
    sale = 'sale',
}

export interface TransactionReturn {
    id: string;
    reference: string;
    url: string;
}

export interface TransactionList {
    transactions: TransactionTable[];
}

export interface TransactionTable {
    id: string;
    url: string;
    order: {
        id: string;
        merchant_ref: string;
        url: string;
    };
    reference: string | null;
    type: TransactionType;
    status: TransactionStatusCodes;
    owner: Owner;
    created_at: string;
    updated_at: string | null;
    cancelled_at: string | null;
    total_amounts: Record<
        'total_amount_including_vat' | 'total_amount_excluding_vat' | 'total_vat' | string,
        AmountWithLabel
    >;
}

export interface GetAllTransactionsSuccessPayload {
    data: TransactionList;
    headers: Headers;
}

export interface UpdateFeePayload {
    label: string;
    amount: Price;
}

export const enum TransactionMode {
    add = 'add',
    subtract = 'subtract',
}
