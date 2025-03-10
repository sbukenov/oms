import { AbstractAccessor } from 'sdkore';

export class PackagingAccessor extends AbstractAccessor {
    constructor() {
        super('/packaging');
    }

    public getProducts(params: { owner?: string[]; business_unit?: string[] }, route = '') {
        return this.client.get(route || `${this.route}/products`, undefined, undefined, { params });
    }

    public getPackagings(params: { owner?: string[]; business_unit?: string[]; search?: string }, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }
}
