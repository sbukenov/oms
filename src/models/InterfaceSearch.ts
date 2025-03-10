import { FulfillmentStatusCodes, ReturnStatusCodes, TransactionStatusCodes } from './InterfaceStatusInfo';
import { TransactionType } from './InterfaceTransaction';

export interface Search {
    search: string;
}

export interface Route {
    route: string;
}

export interface ShipmentsFilter {
    'created_at[from]': string;
    'created_at[to]': string;
    'status[]': string;
    'issuer[]': string;
    issuer: string[];
    isCancelled: boolean;
}

export type ShipmentsParams = ShipmentsFilter & Search & Route;

export type FulfillmentsFilter = {
    'created_at[from]': string;
    'created_at[to]': string;
    status: FulfillmentStatusCodes[];
    owner: string[];
    isCancelled: boolean;
};

export type FulfillmentsParams = FulfillmentsFilter & Search & Route;

export interface ReturnsFilter {
    'status[]': ReturnStatusCodes;
    'owner[]': string;
    'created_at[from]': string;
    'created_at[to]': string;
}

export type ReturnsParams = ReturnsFilter & Search & Route;

export interface TransactionsFilter {
    'created_at[from]': string;
    'created_at[to]': string;
    'type[]': TransactionType;
    'status[]': TransactionStatusCodes;
    'owner[]': string;
    isCancelled: boolean;
}

export type TransactionsParams = TransactionsFilter & Search & Route;

export interface ReplenishmentsFilter {
    type: string[];
}
