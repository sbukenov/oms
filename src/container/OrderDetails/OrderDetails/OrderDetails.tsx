import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { usePrivileges, IdParam } from '@bo/utils';

import { getModuleContext } from '~/utils';
import { useActions } from '~/hooks';
import { OrderDetailsNavLayout } from '~/components';
import { selectOrderDetails } from '~/redux/selectors';
import {
    orderDetailsActions,
    expeditionsActions,
    receptionsActions,
    fulfillmentsActions,
    shipmentsActions,
    returnsActions,
    transactionsActions,
} from '~/redux/slices';

import { OrderHeader } from '../headers';

export const OrderDetails = () => {
    const { id } = useParams<IdParam>();
    const privileges = usePrivileges(getModuleContext());
    const { loading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderDetailsRequest, getOrderBusinessUnits, resetOrderDetails } = useActions(orderDetailsActions);
    const { resetOrderFulfillments } = useActions(fulfillmentsActions);
    const { resetOrderShipments } = useActions(shipmentsActions);
    const { resetOrderReturns } = useActions(returnsActions);
    const { resetOrderTransactions } = useActions(transactionsActions);
    const { resetOrderReceptions } = useActions(receptionsActions);
    const { resetOrderExpeditions } = useActions(expeditionsActions);

    useEffect(() => {
        if (id && !loading && id !== orderDetails?.id) {
            getOrderDetailsRequest(id);
            getOrderBusinessUnits(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, getOrderDetailsRequest, orderDetails?.id]);

    useEffect(() => {
        return () => {
            resetOrderFulfillments();
            resetOrderShipments();
            resetOrderReturns();
            resetOrderTransactions();
            resetOrderReceptions();
            resetOrderExpeditions();
            resetOrderDetails();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!privileges) return null;

    return (
        <div>
            <OrderHeader />
            <OrderDetailsNavLayout />
        </div>
    );
};
