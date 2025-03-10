import { AbstractAccessor } from 'sdkore';

export class MetaAccessor extends AbstractAccessor {
    constructor() {
        super('/meta');
    }

    public async getStatuses() {
        return (await this.client.get(`${this.route}/statuses`)).data;
    }

    public async getTypes() {
        return (await this.client.get(`${this.route}/types`)).data;
    }
}
