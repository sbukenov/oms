import { call, put, takeLatest } from 'redux-saga/effects';

import { stockOperationAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils';
import type { ReplenishmentOperations } from '~/models';
import { getOrderReceptionsSuccess, getOrderReceptionsFailure, getOrderReceptionsRequest } from '~/redux/slices';

function* getOrderReceptionsSaga({ payload: orderId }: ReturnType<typeof getOrderReceptionsRequest>) {
    try {
        const { replenishment_operations }: ReplenishmentOperations = yield call(() =>
            stockOperationAccessor.getReplenishmentOperation(orderId, { type: ['reception'] }),
        );
        yield put(getOrderReceptionsSuccess({ receptions: replenishment_operations, orderId }));
    } catch (error) {
        yield put(getOrderReceptionsFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getOrderReceptionsRequest.type, getOrderReceptionsSaga);
}
