import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import Typography from 'antd/lib/typography';

import { ROUTE_PREPARATION, ROUTE_DELIVERY, QA_DELIVERY_STATUS, QA_PREPARATION_STATUS } from '~/const';
import { Status } from '~/components';
import { OrderFulfillmentStatusCodes, OrderShipmentStatusCodes } from '~/models';
import { selectOrderDetailsData } from '~/redux/selectors';

import { ExtraContentRoot } from './ExtraNavContent.styled';

const { Title } = Typography;

export const ExtraNavContent: FC = () => {
    const { t } = useTranslation();
    const order = useSelector(selectOrderDetailsData);
    const location = useLocation();
    const activeTab = location.pathname.split('/').pop();

    if (!order) {
        return null;
    }
    switch (activeTab) {
        case ROUTE_PREPARATION:
            return (
                <ExtraContentRoot data-testid="extra-nav-content-root">
                    <Title level={5}>{t('order.info.preparation_status')}</Title>
                    {order.cancelled_at ? (
                        <Status
                            className={QA_PREPARATION_STATUS}
                            group="orderFulfillment"
                            code={OrderFulfillmentStatusCodes.CANCELLED}
                        />
                    ) : (
                        <Status
                            className={QA_PREPARATION_STATUS}
                            group="orderFulfillment"
                            code={order.fulfillment?.status}
                        />
                    )}
                </ExtraContentRoot>
            );
        case ROUTE_DELIVERY:
            return (
                <ExtraContentRoot data-testid="extra-nav-content-root">
                    <Title level={5}>{t('order.info.delivery_status')}</Title>
                    {order.cancelled_at ? (
                        <Status
                            className={QA_DELIVERY_STATUS}
                            group="orderShipment"
                            code={OrderShipmentStatusCodes.CANCELLED}
                        />
                    ) : (
                        <Status className={QA_DELIVERY_STATUS} group="orderShipment" code={order.shipment?.status} />
                    )}
                </ExtraContentRoot>
            );
        default:
            return null;
    }
};
