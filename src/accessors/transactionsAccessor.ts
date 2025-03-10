import { AbstractAccessor } from 'sdkore';

import type { TransactionsParams, UpdateFeePayload } from '~/models';

export class TransactionsAccessor extends AbstractAccessor {
    constructor() {
        super('/transactions');
    }

    public getTransactions(params: Partial<TransactionsParams>, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }

    public updateTransactionFee(id: string, feeId: string, payload: UpdateFeePayload) {
        return this.client.put(`${this.route}/${id}/fees/${feeId}`, payload);
    }

    public addTransactionFee(id: string, payload: UpdateFeePayload) {
        return this.client.post(`${this.route}/${id}/fees`, payload);
    }
}
