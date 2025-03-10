import { AbstractAccessor } from 'sdkore';

import type { LogisticUnitsBulkCreationData, ReplenishmentOperationCreationData, ReplenishmentsFilter } from '~/models';

export class StockOperationAccessor extends AbstractAccessor {
    constructor() {
        super('/stock-operation');
    }

    public async getReplenishmentOperation(orderId: string, params: ReplenishmentsFilter) {
        return (
            await this.client.get(`${this.route}/replenishment-operation/orders/${orderId}`, undefined, undefined, {
                params,
            })
        ).data;
    }

    public createReplenishmentOperation(data: ReplenishmentOperationCreationData) {
        return this.client.post(`${this.route}/replenishment-operation`, data);
    }

    public createManyLogisticUnits(data: LogisticUnitsBulkCreationData) {
        return this.client.post(`${this.route}/logistic-unit/many`, data);
    }

    public async getOneReplenishmentOperation(id: string) {
        return (await this.client.get(`${this.route}/replenishment-operation/${id}`)).data;
    }

    public deleteAttachment(id: string) {
        return this.client.delete(`${this.route}/replenishment-operation/attachment/${id}/delete`);
    }
}
