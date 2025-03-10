import { call, put, select, takeLatest, debounce } from 'redux-saga/effects';
import type { ClientResponse } from 'sdkore';
import { Entity, getSelectedEntity, MAIN_ENTITY_UUID, SEARCH_DEBOUNCE } from '@bo/utils';

import { MIN_LETTERS_FOR_SEARCHING } from '~/const';
import type { GetPackagingsResponse } from '~/models';
import { applyPackagingConditions } from '~/utils';
import { showErrorNotification } from '~/utils/notification';
import { packagingAccessor } from '~/utils/accessors';

import { selectSelectedSupplier, selectPackagingsNext } from '../selectors';
import {
    getPackagingsFailure,
    getPackagingsRequest,
    getPackagingsSuccess,
    loadPackagings,
    searchPackagings,
    resetPackagings,
} from '../slices';

function* loadPackagingsSaga({ payload: search }: ReturnType<typeof loadPackagings>) {
    try {
        const next: ReturnType<typeof selectPackagingsNext> = yield select(selectPackagingsNext);
        if (search === '') {
            yield put(resetPackagings());
            return;
        }
        if (search && search.length <= MIN_LETTERS_FOR_SEARCHING) return;

        yield put(getPackagingsRequest());
        const supplierUuid: string | undefined = yield select(selectSelectedSupplier);
        const entity: Entity | undefined = yield call(getSelectedEntity);
        const entityUuid = entity?.uuid || MAIN_ENTITY_UUID;

        if (!supplierUuid) return;

        const packagings: ClientResponse<GetPackagingsResponse> = yield call(
            [packagingAccessor, 'getPackagings'],
            {
                owner: [supplierUuid],
                business_unit: [entityUuid],
                search,
            },
            next,
        );

        yield call(applyPackagingConditions, packagings.data.packaging_lines);
        yield put(getPackagingsSuccess(packagings));
    } catch (error: any) {
        yield call(showErrorNotification, error);
        yield put(getPackagingsFailure());
    }
}

export default function* watcher() {
    yield takeLatest(loadPackagings.type, loadPackagingsSaga);
    yield debounce(SEARCH_DEBOUNCE, searchPackagings.type, loadPackagingsSaga);
}
