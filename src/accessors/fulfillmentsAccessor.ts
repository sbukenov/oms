import { AbstractAccessor } from 'sdkore';

import type { TransitFulfillmentItemsBody, CompleteFulfillmentBody, FulfillmentsParams } from '~/models';

export class FulfillmentsAccessor extends AbstractAccessor {
    constructor() {
        super('/fulfillments');
    }

    public transitFulfillmentItems(fulfillmentId: string, body: TransitFulfillmentItemsBody) {
        return this.client.post(`${this.route}/${fulfillmentId}/items/transition`, body);
    }

    public getOneDetailedFulfillment(fulfillmentId: string) {
        return this.client.get(`${this.route}/${fulfillmentId}/detailed`);
    }

    public completeFulfillment(fulfillmentId: string, body: CompleteFulfillmentBody) {
        return this.client.post(`${this.route}/${fulfillmentId}/items/completion`, body);
    }

    public getFulfillments(params: Partial<FulfillmentsParams>, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }
}
