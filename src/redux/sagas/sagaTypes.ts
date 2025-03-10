import { call, put, takeLatest } from 'redux-saga/effects';

import type { Types } from '~/models';
import { metaAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils/notification';
import { getTypes, getTypesSuccess, getTypesFailure } from '~/redux/slices';

export function* getTypesSaga() {
    try {
        const types: Types = yield call(() => metaAccessor.getTypes());
        yield put(getTypesSuccess(types));
    } catch (error: any) {
        yield put(getTypesFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getTypes.type, getTypesSaga);
}
