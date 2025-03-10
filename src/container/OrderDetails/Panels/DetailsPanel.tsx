import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLineConfiguration,  } from '@bo/utils';

import type { OrderFull, OrderDetailsPanelDefaultLines, OrderType, OrderDetailsPanelLines } from '~/models';
import { DEFAULT_DASH, CONFIG_LINES__ORDER_DETAILS_PANEL, QA_ORDER_DETAILS_PANEL } from '~/const';
import { OrderPanelWithItems, OrderPanelItem, AddressLine } from '~/components';
import { selectOrderDetails } from '~/redux/selectors';

interface OrderDetailsPanelProps {
    linesConfiguration: OrderDetailsPanelLines[];
}

export const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ linesConfiguration }) => {
    const { t } = useTranslation();
    const { data: order } = useSelector(selectOrderDetails);

    const defaultLines: { [key in OrderDetailsPanelDefaultLines]?: OrderPanelItem } = {
        TYPE: {
            path: 'type',
            title: t('order.info.type'),
            icon: [, 'information'],
            render: (type: OrderType) => (type ? t(`type.Order.${type}`) : DEFAULT_DASH),
        },
        ADDRESS: {
            path: 'shipping_address',
            title: t('order.info.shipping_address'),
            icon: [, 'location'],
            render: (address: OrderFull['shipping_address']) => {
                return <AddressLine address={address} />;
            },
        },
    };

    const items = useLineConfiguration(
        linesConfiguration,
        order?.currency,
        CONFIG_LINES__ORDER_DETAILS_PANEL,
        defaultLines,
    );

    if (!items.length) {
        return null;
    }

    return (
        <OrderPanelWithItems
            className={QA_ORDER_DETAILS_PANEL}
            title={t('order.info.title')}
            order={order}
            items={items}
        />
    );
};
