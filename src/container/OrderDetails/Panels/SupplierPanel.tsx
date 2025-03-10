import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLineConfiguration } from '@-bo/utils';

import { SpinStyled } from '~/style/commonStyle';
import {
    DEFAULT_DASH,
    SHORT_CONFIG_LINES__SUPPLIER_PANEL,
    CONFIG_LINES__SUPPLIER_PANEL,
    ,
    QA_SUPPLIER_INFO_PANEL,
} from '~/const';
import { OrderPanelWithItems, OrderPanelItem } from '~/components';
import { selectLoadingOrder, getSupplier, getSupplierLoading, selectOrderDetailsData } from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import { getModuleContext } from '~/utils';
import { useActions } from '~/hooks';
import { CustomerPanelDefaultLines } from '~/models';

export const SupplierPanel = () => {
    const { t } = useTranslation();
    const loading = useSelector(selectLoadingOrder);
    const order = useSelector(selectOrderDetailsData);
    const supplierLoading = useSelector(getSupplierLoading);
    const supplier = useSelector(getSupplier);
    const { config } = useContext(getModuleContext());
    const { getSupplierRequest } = useActions(orderDetailsActions);

    useEffect(() => {
        order?.owner?.id && getSupplierRequest(order?.owner?.id);
    }, [getSupplierRequest, order?.owner?.id]);

    const linesConfiguration =
        config?.specific?.orderDetails?.tabs?.order?.panels?.supplier || SHORT_CONFIG_LINES__SUPPLIER_PANEL;

    const defaultLines: { [key in CustomerPanelDefaultLines]?: OrderPanelItem } = {
        EMAIL: {
            path: 'entity_address.mail',
            title: t('order.supplier.email'),
            icon: [, 'mail'],
            render: (mail: string) => {
                return mail ? <a href={`mailto:${mail}`}>{mail}</a> : DEFAULT_DASH;
            },
        },
    };

    const items = useLineConfiguration(linesConfiguration, order?.currency, CONFIG_LINES__SUPPLIER_PANEL, defaultLines);

    if (!items.length) {
        return null;
    }

    return (
        <SpinStyled spinning={loading || supplierLoading}>
            <OrderPanelWithItems
                className={QA_SUPPLIER_INFO_PANEL}
                title={t('order.supplier.title')}
                order={supplier}
                items={items}
            />
        </SpinStyled>
    );
};
