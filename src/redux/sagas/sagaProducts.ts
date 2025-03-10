import { Entity, getSelectedEntity, MAIN_ENTITY_UUID, SEARCH_DEBOUNCE } from '@bo/utils';
import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';

import { showErrorNotification } from '~/utils/notification';
import { packagingAccessor } from '~/utils/accessors';
import { GetProductsSuccessPayload } from '~/models';

import {
    getProductsRequest,
    getProductsSuccess,
    getProductsFailure,
    loadProducts,
    loadProductsNextPage,
    loadProductsPrevPage,
    searchProducts,
} from '../slices';
import { selectProductsHeaderNext, selectProductsHeaderPrev, selectSelectedSupplier } from '../selectors';

function* loadProductsSaga({ payload }: ReturnType<typeof loadProducts>) {
    try {
        const { search, supplier } = payload || {};
        yield put(getProductsRequest());
        const supplierUuid: string | undefined = (yield select(selectSelectedSupplier)) || supplier;
        const entity: Entity | undefined = yield call(getSelectedEntity);
        const entityUuid = entity?.uuid || MAIN_ENTITY_UUID;

        if (!supplierUuid) {
            throw new Error('no supplier uuid provided');
        }

        const products: GetProductsSuccessPayload = yield call([packagingAccessor, 'getProducts'], {
            owner: [supplierUuid],
            business_unit: [entityUuid],
            ...(search && { search }),
        });

        yield put(getProductsSuccess(products));
    } catch (error: any) {
        yield call(showErrorNotification, error);
        yield put(getProductsFailure());
    }
}

function* getProductsByRoute(route: string) {
    try {
        yield put(getProductsRequest());

        const products: GetProductsSuccessPayload = yield call([packagingAccessor, 'getProducts'], {}, route);

        yield put(getProductsSuccess(products));
    } catch (error: any) {
        yield call(showErrorNotification, error);
        yield put(getProductsFailure());
    }
}

function* loadNextProductsPageSaga() {
    const next: ReturnType<typeof selectProductsHeaderNext> = yield select(selectProductsHeaderNext);
    if (!next) return;

    yield* getProductsByRoute(next);
}

function* loadPrevProductsPageSaga() {
    const prev: ReturnType<typeof selectProductsHeaderPrev> = yield select(selectProductsHeaderPrev);
    if (!prev) return;

    yield* getProductsByRoute(prev);
}

export default function* watcher() {
    yield takeLatest(loadProducts.type, loadProductsSaga);
    yield takeLatest(loadProductsNextPage.type, loadNextProductsPageSaga);
    yield takeLatest(loadProductsPrevPage.type, loadPrevProductsPageSaga);
    yield debounce(SEARCH_DEBOUNCE, searchProducts.type, loadProductsSaga);
}
