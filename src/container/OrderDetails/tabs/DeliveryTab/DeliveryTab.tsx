import React, { FC, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { usePrivileges, IdParam } from '@bo/utils';

import { EmptyState } from '~/components';
import { useActions } from '~/hooks';
import { getModuleContext, redirectToFirstAvailableTab } from '~/utils';
import { selectOrderDetailsData, selectOrderShipments } from '~/redux/selectors';
import { shipmentsActions } from '~/redux/slices';
import { PRIVILEGE_DELIVERY_TAB } from '~/const';

import { CommentPanel } from '../../comments';
import { DeliveryTable } from '../../tables';

export const DeliveryTab: FC = () => {
    const { id } = useParams<IdParam>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const order = useSelector(selectOrderDetailsData);
    const { shipments, orderId, loading: isShipmentLoading } = useSelector(selectOrderShipments);
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const { getOrderShipmentsRequest } = useActions(shipmentsActions);

    const displayComments = !!config?.specific?.orderDetails?.tabs?.delivery?.displayComments ?? true;

    useEffect(() => {
        if (!id) return;

        if (!!privileges?.size && !privileges.has(PRIVILEGE_DELIVERY_TAB)) {
            redirectToFirstAvailableTab({ baseRoute, id, privileges, navigate, t });
            return;
        }

        privileges?.has(PRIVILEGE_DELIVERY_TAB) && !isShipmentLoading && id !== orderId && getOrderShipmentsRequest(id);
        // to exclude "isShipmentLoading"
        // eslint-disable-next-line
    }, [id, getOrderShipmentsRequest, orderId, privileges, baseRoute, t]);

    const comments = displayComments && <CommentPanel commentsCount={order?.comments?.length} />;

    if (!shipments.length || !order)
        return (
            <>
                <EmptyState
                    title={t('order_shipment_detailed.empty.title')}
                    subtitle={t('order_shipment_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {shipments?.map((shipment, index) => (
                <DeliveryTable index={index} shipment={shipment} key={shipment.id} order={order} />
            ))}
            {comments}
        </>
    );
};
