import type { OrderReturn, ReturnReason } from '../InterfaceReturn';

export interface ReturnsStore {
    orderReturns: {
        loading: boolean;
        orderId?: string;
        returns: OrderReturn[];
    };
    table: {
        loading: boolean;
        returns: OrderReturn[];
        headers: {
            next?: string;
            prev?: string;
        };
        filters: Record<string, any>;
        search: string;
        route?: string;
    };
    reasons: ReturnReason[];
}

export type LoadReturnsPayload = { route?: string } | undefined;
