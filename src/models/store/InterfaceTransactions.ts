import type { OrderTransactions, TransactionTable } from '../InterfaceTransaction';

export interface TransactionsStore {
    orderTransactions: {
        loading: boolean;
        orderId: string | undefined;
        transactions: OrderTransactions;
    };
    table: {
        transactions: TransactionTable[];
        loading: boolean;
        isApplyingAction: boolean;
        headers: {
            next?: string;
            prev?: string;
        };
        search: string;
        filters: Record<string, any>;
        route?: string;
    };
}
