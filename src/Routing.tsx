import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { NoAccessPage } from '@bo/keystone-components';

import { useActions } from '~/hooks';
import { selectIsInitialized } from './redux/selectors';
import { initialActions } from '~/redux/slices';
import { getModuleContext } from '~/utils';
import {
    ROUTE_FULFILLMENTS,
    ROUTE_PREPARE,
    ROUTE_ORDERS,
    ROUTE_ORDER_DETAILS,
    ROUTE_DELIVERIES,
    ROUTE_RETURNS,
    ROUTE_TRANSACTIONS,
    ROUTE_DELIVERY,
    ROUTE_PREPARATION,
    ROUTE_RETURN,
    ROUTE_TRANSACTION,
    ROUTE_EXPEDITION,
    ROUTE_RECEPTION,
    ROUTE_NO_ACCESS,
    ROUTE_CREATION,
    ROUTE_DUPLICATION,
    ROUTE_EDITION,
    ROUTE_RECEPTION_DETAILS,
} from '~/const';
import { Layout } from '~/container/Layout';
import {
    OrdersPage,
    OrderDetails,
    FulfillmentPreparation,
    Fulfillments,
    Returns,
    Deliveries,
    Transactions,
    SynthesisTab,
    PreparationTab,
    DeliveryTab,
    ReturnTab,
    TransactionTab,
    OrderCreation,
    OrderDuplication,
    OrderEdition,
    ReceptionTab,
    ExpeditionTab,
    ReceptionCreation,
} from '~/container';

export const Routing: React.FC = () => {
    const { t } = useTranslation();
    const { initAction } = useActions(initialActions);
    const { config, baseRoute, aggregatorOrchestrator } = useContext(getModuleContext());
    const isInitialized = useSelector(selectIsInitialized);

    useEffect(() => {
        initAction({
            ...config?.specific,
            privileges: aggregatorOrchestrator?.getGlobalConfig().privileges || [],
            baseRoute,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isInitialized) return null;

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={ROUTE_ORDERS}>
                    <Route index element={<OrdersPage />} />
                    <Route path={ROUTE_CREATION} element={<OrderCreation />} />
                    <Route path={ROUTE_DUPLICATION} element={<OrderDuplication />} />
                    <Route path={ROUTE_EDITION} element={<OrderEdition />} />
                    <Route path=":key" element={<OrdersPage />} />
                </Route>
                <Route path={ROUTE_ORDER_DETAILS} element={<OrderDetails />}>
                    <Route index element={<SynthesisTab />} />
                    <Route path={ROUTE_PREPARATION} element={<PreparationTab />} />
                    <Route path={ROUTE_DELIVERY} element={<DeliveryTab />} />
                    <Route path={ROUTE_RETURN} element={<ReturnTab />} />
                    <Route path={ROUTE_TRANSACTION} element={<TransactionTab />} />
                    <Route path={ROUTE_EXPEDITION} element={<ExpeditionTab />} />
                    <Route path={ROUTE_RECEPTION} element={<ReceptionTab />} />
                </Route>
                <Route path={ROUTE_FULFILLMENTS}>
                    <Route index element={<Fulfillments />} />
                    <Route path={ROUTE_PREPARE} element={<FulfillmentPreparation />} />
                    <Route path=":key" element={<Fulfillments />} />
                </Route>
                <Route path={ROUTE_DELIVERIES}>
                    <Route index element={<Deliveries />} />
                    <Route path=":key" element={<Deliveries />} />
                </Route>
                <Route path={ROUTE_RETURNS}>
                    <Route index element={<Returns />} />
                    <Route path=":key" element={<Returns />} />
                </Route>
                <Route path={ROUTE_TRANSACTIONS}>
                    <Route index element={<Transactions />} />
                    <Route path=":key" element={<Transactions />} />
                </Route>
                <Route path={ROUTE_RECEPTION_DETAILS} element={<ReceptionCreation />} />
                <Route
                    path={ROUTE_NO_ACCESS}
                    element={<NoAccessPage title={t('common.no_access')} text={t('common.no_access_to_page')} />}
                />
            </Route>
        </Routes>
    );
};
