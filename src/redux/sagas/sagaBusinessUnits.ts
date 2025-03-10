import { call, put, takeLatest } from 'redux-saga/effects';
import { GetBusinessUnitsResponse } from '@bo/utils';

import { businessUnitsAccessor } from '~/utils/accessors';
import { showErrorNotification } from '~/utils/notification';
import { getBusinessUnits, getBusinessUnitsSuccess, getBusinessUnitsFailure } from '../slices';

export function* getBusinessUnitsSaga() {
    try {
        const { business_units }: GetBusinessUnitsResponse = yield call(() => businessUnitsAccessor.read());
        yield put(getBusinessUnitsSuccess(business_units));
    } catch (error: any) {
        yield put(getBusinessUnitsFailure());
        yield call(showErrorNotification, error);
    }
}

export default function* watcher() {
    yield takeLatest(getBusinessUnits.type, getBusinessUnitsSaga);
}
