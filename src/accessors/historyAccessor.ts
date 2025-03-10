import { AbstractAccessor } from 'sdkore';

import type { HistoryRequestParams } from '~/models';

export class HistoryAccessor extends AbstractAccessor {
    constructor() {
        super('/history');
    }

    public async getListByType(type: string, id: string, params: HistoryRequestParams) {
        return (await this.client.get(`${this.route}/${type}/${id}`, undefined, undefined, { params })).data;
    }
}
