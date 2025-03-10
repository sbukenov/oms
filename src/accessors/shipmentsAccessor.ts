import { AbstractAccessor } from 'sdkore';

import type { ShipmentsParams, TransitionPayload } from '~/models';

export class ShipmentsAccessor extends AbstractAccessor {
    constructor() {
        super('/shipments');
    }

    public deleteShipmentAttachment(id: string, attachmentId: string) {
        return this.client.delete(`${this.route}/${id}/attachment/${attachmentId}/delete`);
    }

    public getShipments(params: Partial<ShipmentsParams>, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }

    public applyTransition(id: string, payload: TransitionPayload) {
        return this.client.post(`${this.route}/${id}`, payload);
    }
}
