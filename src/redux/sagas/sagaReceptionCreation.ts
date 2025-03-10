import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { ClientResponse } from 'sdkore';
import { Entity, getSelectedEntity, MAIN_ENTITY_UUID } from '@bo/utils';

import { mapLogisticUnitsForReception, showErrorNotification } from '~/utils';
import {
    getReception,
    getReceptionSuccess,
    getReceptionFailure,
    createReception,
    createReceptionSuccess,
    createReceptionFailure,
    getOrderReceptionsRequest,
    addReceptionProductKeys,
    addReceptionProducts,
} from '~/redux/slices';
import { stockOperationAccessor } from '~/utils/accessors';
import type { Product, ReplenishmentOperations } from '~/models';

import { selectOrderDetailsData, selectProductsByKeys, selectReceptionDetails } from '../selectors';

function* getReceptionSaga({ payload }: ReturnType<typeof getReception>) {
    try {
        const { orderId, expeditionId } = payload;
        // TODO: Uncomment this, when the "stock-operation/replenishment-operation/${id}" is fixed
        // currently it returns incomplete data, and can not be used to complete the user story
        // const replenishmentOperation: ReplenishmentOperation = yield call(
        //     [stockOperationAccessor, 'getOneReplenishmentOperation'],
        //     id,
        // );
        // TODO: Remove this request, when the issue described there ^^^ is fixed
        const { replenishment_operations }: ReplenishmentOperations = yield call(() =>
            stockOperationAccessor.getReplenishmentOperation(orderId, { type: ['expedition'] }),
        );
        const replenishmentOperation = replenishment_operations.find(({ id }) => id === expeditionId);

        if (!replenishmentOperation) throw new Error('No such replenishment operation exists');

        yield put(getReceptionSuccess(replenishmentOperation));
    } catch (error) {
        yield put(getReceptionFailure());
        yield call(showErrorNotification, error);
    }
}

function* createReceptionSaga({ payload }: ReturnType<typeof createReception>) {
    try {
        const { quantitiesById, onSuccess } = payload;
        const entity: Entity | undefined = yield call(getSelectedEntity);
        const order: ReturnType<typeof selectOrderDetailsData> = yield select(selectOrderDetailsData);
        const reception: ReturnType<typeof selectReceptionDetails> = yield select(selectReceptionDetails);

        if (!order?.id) {
            throw new Error('no order id in store');
        }

        const response: ClientResponse<any> = yield call(
            [stockOperationAccessor, stockOperationAccessor.createReplenishmentOperation],
            {
                type: 'reception',
                reference: null,
                barcode: null,
                recipient: entity?.uuid || MAIN_ENTITY_UUID,
                shipper: reception!.shipper.id,
                order_id: order.id,
            },
        );

        const receptionId = response.headers.location.split('/').pop();

        yield call(
            [stockOperationAccessor, stockOperationAccessor.createManyLogisticUnits],
            mapLogisticUnitsForReception(receptionId, quantitiesById),
        );
        yield put(createReceptionSuccess());
        yield call(onSuccess);
        yield put(getOrderReceptionsRequest(order.id));
    } catch (error) {
        yield put(createReceptionFailure());
        yield call(showErrorNotification, error);
    }
}

function* addReceptionProductsSaga({ payload }: ReturnType<typeof addReceptionProductKeys>) {
    try {
        const products: Product[] = yield select(selectProductsByKeys(payload));
        yield put(addReceptionProducts(products));
    } catch (error: any) {
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getReception.type, getReceptionSaga);
    yield takeLatest(createReception.type, createReceptionSaga);
    yield takeLatest(addReceptionProductKeys.type, addReceptionProductsSaga);
}
