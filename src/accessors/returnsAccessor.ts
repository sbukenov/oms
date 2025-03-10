import { AbstractAccessor } from 'sdkore';
import { ReturnsFilter } from '../models';

export class ReturnsAccessor extends AbstractAccessor {
    constructor() {
        super('/returns');
    }

    public getReturnReasons() {
        return this.client.get(`${this.route}/reasons`);
    }

    public getReturns(params: Partial<ReturnsFilter>, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }
}
