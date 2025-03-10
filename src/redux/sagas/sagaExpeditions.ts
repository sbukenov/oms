import { call, put, select, takeLatest } from 'redux-saga/effects';

import { stockOperationAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils';
import type { ReplenishmentOperations } from '~/models';
import {
    getOrderExpeditionsSuccess,
    getOrderExpeditionsFailure,
    getOrderExpeditionsRequest,
    deleteExpeditionAttachment,
    deleteExpeditionAttachmentSuccess,
    deleteExpeditionAttachmentFailure,
} from '~/redux/slices';
import { selectOrderDetailsId } from '../selectors';

function* getOrderExpeditionsSaga({ payload: orderId }: ReturnType<typeof getOrderExpeditionsRequest>) {
    try {
        const { replenishment_operations }: ReplenishmentOperations = yield call(() =>
            stockOperationAccessor.getReplenishmentOperation(orderId, { type: ['expedition'] }),
        );
        yield put(getOrderExpeditionsSuccess({ expeditions: replenishment_operations, orderId }));
    } catch (error) {
        yield put(getOrderExpeditionsFailure());
        yield call(showErrorNotification, error);
    }
}

function* deleteExpeditionAttachmentSaga({ payload }: ReturnType<typeof deleteExpeditionAttachment>) {
    try {
        const { attachmentId, onSuccess } = payload;
        const orderId: ReturnType<typeof selectOrderDetailsId> = yield select(selectOrderDetailsId);

        yield call([stockOperationAccessor, 'deleteAttachment'], attachmentId);
        yield put(deleteExpeditionAttachmentSuccess());
        if (orderId) {
            yield put(getOrderExpeditionsRequest(orderId));
        }
        yield call(onSuccess);
    } catch (error) {
        yield put(deleteExpeditionAttachmentFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getOrderExpeditionsRequest.type, getOrderExpeditionsSaga);
    yield takeLatest(deleteExpeditionAttachment.type, deleteExpeditionAttachmentSaga);
}
