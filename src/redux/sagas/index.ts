import { fork } from 'redux-saga/effects';

import watchOrders from './sagaOrders';
import watchOrderDetails from './sagaOrderDetails';
import watchFulfillments from './sagaFulfillments';
import watchShipments from './sagaShipments';
import watchReturns from './sagaReturns';
import watchTransactions from './sagaTransactions';
import watchInit from './sagaInitial';
import watchTypes from './sagaTypes';
import watchOrderCreation from './sagaOrderCreation';
import watchProducts from './sagaProducts';
import watchPackagings from './sagaPackagings';
import watchReceptions from './sagaReceptions';
import watchExpeditions from './sagaExpeditions';
import watchReceptionDetails from './sagaReceptionCreation';
import watchBusinessUnits from './sagaBusinessUnits';

export * from './sagaOrders';
export * from './sagaOrderDetails';
export * from './sagaFulfillments';
export * from './sagaShipments';
export * from './sagaReturns';
export * from './sagaTransactions';
export * from './sagaInitial';
export * from './sagaTypes';
export * from './sagaOrderCreation';
export * from './sagaProducts';
export * from './sagaPackagings';
export * from './sagaReceptions';
export * from './sagaExpeditions';
export * from './sagaReceptionCreation';
export * from './sagaBusinessUnits';

export default function* rootSaga() {
    yield fork(watchOrders);
    yield fork(watchOrderDetails);
    yield fork(watchFulfillments);
    yield fork(watchShipments);
    yield fork(watchReturns);
    yield fork(watchTransactions);
    yield fork(watchInit);
    yield fork(watchTypes);
    yield fork(watchOrderCreation);
    yield fork(watchProducts);
    yield fork(watchPackagings);
    yield fork(watchReceptions);
    yield fork(watchExpeditions);
    yield fork(watchReceptionDetails);
    yield fork(watchBusinessUnits);
}
