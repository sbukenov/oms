import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLineConfiguration } from '@-bo/utils';

import {
    DEFAULT_DASH,
    SHORT_CONFIG_LINES__CUSTOMER_PANEL,
    CONFIG_LINES__CUSTOMER_PANEL,
    ,
    QA_CUSTOMER_INFO_PANEL,
} from '~/const';
import { OrderPanelWithItems, OrderPanelItem } from '~/components';
import { selectOrderDetails } from '~/redux/selectors';
import { getModuleContext } from '~/utils';
import { CustomerPanelDefaultLines } from '~/models';

export const OrderCustomerPanel = React.memo(() => {
    const { t } = useTranslation();
    const { data: order } = useSelector(selectOrderDetails);
    const { config } = useContext(getModuleContext());

    const linesConfiguration =
        config?.specific?.orderDetails?.tabs?.synthesis?.panels?.customer || SHORT_CONFIG_LINES__CUSTOMER_PANEL;

    const defaultLines: { [key in CustomerPanelDefaultLines]?: OrderPanelItem } = {
        EMAIL: {
            path: 'customer.email',
            title: t('order.customer.email'),
            icon: [, 'mail'],
            render: (mail: string) => {
                return mail ? <a href={`mailto:${mail}`}>{mail}</a> : DEFAULT_DASH;
            },
        },
    };

    const items = useLineConfiguration(linesConfiguration, order?.currency, CONFIG_LINES__CUSTOMER_PANEL, defaultLines);

    if (!items.length) {
        return null;
    }

    return (
        <OrderPanelWithItems
            className={QA_CUSTOMER_INFO_PANEL}
            title={t('order.customer.title')}
            order={order}
            items={items}
        />
    );
});
