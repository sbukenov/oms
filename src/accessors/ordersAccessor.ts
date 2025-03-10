import { AbstractAccessor } from 'sdkore';

import type {
    OrderListRequestParams,
    OrdersData,
    CreateReturnsPayload,
    ShippingAddressFormData,
    ShipmentCreationPayload,
    CommentForm,
    AddLinesBulkData,
    DeleteLinesBulkData,
    EditLineData,
} from '~/models';
import { OrderSaveBody } from '../models';

export class OrdersAccessor extends AbstractAccessor<OrdersData, 'id'> {
    constructor() {
        super('/orders');
    }

    public saveOrder(data: OrderSaveBody) {
        return this.client.post(this.route, data);
    }

    public getOrders(params: OrderListRequestParams, route = '') {
        return this.client.get(route || this.route, undefined, undefined, { params });
    }

    /*** COMMENTS ***/
    public addComment(orderId: string, data: CommentForm) {
        return this.client.post(`${this.route}/${orderId}/comments`, data);
    }

    public editComment(orderId: string, commentId: string, data: { title: string; content?: string }) {
        return this.client.put(`${this.route}/${orderId}/comments/${commentId}`, data);
    }

    public deleteComment(orderId: string, commentId: string) {
        return this.client.delete(`${this.route}/${orderId}/comments/${commentId}`);
    }

    /*** ORDER FULFILLMENTS ***/
    public getFulfilmentDetailed(orderId: string) {
        return this.client.get(`${this.route}/${orderId}/fulfillment/fulfillments/detailed`);
    }

    /*** ORDER SHIPMENTS ***/
    public getShipments(orderId: string) {
        return this.client.get(`${this.route}/${orderId}/shipment/shipments/detailed`);
    }

    public createShipment(orderId: string, payload: ShipmentCreationPayload) {
        return this.client.post(`${this.route}/${orderId}/shipment/shipments`, payload);
    }

    /*** ORDER RETURNS ***/
    public getReturns(orderId: string) {
        return this.client.get(`${this.route}/${orderId}/return/returns/detailed`);
    }

    public createReturns(orderId: string, data: CreateReturnsPayload) {
        return this.client.post(`${this.route}/${orderId}/returns`, data);
    }

    /*** ORDER SHIPPING ADDRESS  ***/
    public editShippingAddress(orderId: string, data: ShippingAddressFormData) {
        return this.client.put(`${this.route}/${orderId}/addresses/shipping`, data);
    }

    /*** ORDER TRANSACTIONS  ***/
    public getTransactions(orderId: string) {
        return this.client.get(`${this.route}/${orderId}/transaction/transactions/detailed`);
    }

    /*** ORDER BUSINESS UNITS  ***/
    public async getBusinessUnits(orderId: string) {
        return (await this.client.get(`${this.route}/${orderId}/business_units`)).data;
    }

    /*** ORDER LINES ***/
    public addManyLines(orderId: string, data: AddLinesBulkData) {
        return this.client.post(`${this.route}/${orderId}/lines/many`, data);
    }
    public deleteManyLines(orderId: string, data: DeleteLinesBulkData) {
        return this.client.delete(`${this.route}/${orderId}/lines/many`, data);
    }
    public editOrderLine(orderId: string, lineId: string, data: EditLineData) {
        return this.client.put(`${this.route}/${orderId}/lines/${lineId}`, data);
    }
}
