import { call, takeLatest, put, all } from 'redux-saga/effects';

import { showErrorNotification } from '~/utils/notification';

import { initAction, addConfig, initActionSuccess } from '../slices';

import { getAllStatusesSaga } from './sagaOrders';
import { getBusinessUnitsSaga } from './sagaBusinessUnits';
import { getTypesSaga } from './sagaTypes';

export function* init({ payload }: ReturnType<typeof initAction>) {
    try {
        yield put(addConfig(payload));
        yield all([call(getBusinessUnitsSaga), call(getAllStatusesSaga), call(getTypesSaga)]);
        yield put(initActionSuccess());
    } catch (error: any) {
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(initAction.type, init);
}
