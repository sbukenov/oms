import { AbstractAccessor } from 'sdkore';

export class ReplenishmentConditionsAccessor extends AbstractAccessor {
    constructor() {
        super('/replenishment_condition');
    }

    public async getReplenishmentConditions(
        criteria: { business_unit?: string; search?: string; supplier?: string[] } = {},
        route = '',
    ) {
        const query = await this.buildQueryString(criteria);
        return this.client.get(route || `${this.route}?${query}`);
    }
}
