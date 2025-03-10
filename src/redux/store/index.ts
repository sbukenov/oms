import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import type { RootState } from '~/models';
import { packageName } from '~/const';

import { rootReducer } from '../slices';
import rootSaga from '../sagas';

import { defaultState as preloadedState } from './initialStates';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore<RootState>({
    preloadedState,
    reducer: rootReducer,
    middleware: [sagaMiddleware],
    devTools: { name: packageName },
});

sagaMiddleware.run(rootSaga);
