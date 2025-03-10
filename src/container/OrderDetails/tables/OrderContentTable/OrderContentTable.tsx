import React, { FC, useCallback, useContext, useMemo } from 'react';
import type { ColumnProps } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Space, Divider, Empty } from 'antd';
import { useColumnConfiguration, usePrivileges } from '@-bo/utils';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';

import type { OrderFull, OrderLine, OrderContentTableDefaultColumns } from '~/models';
import { OrderFulfillmentStatusCodes, OrderShipmentStatusCodes } from '~/models';
import {
    SHORT_CONFIG_COLUMN__ORDER_DETAILS,
    CONFIG_COLUMN__ORDER_DETAILS,
    QA_SYNTHESIS_DELIVERY_STATUS,
    QA_SYNTHESIS_PREPARATION_STATUS,
    QA_ORDER_TABLE,
} from '~/const';
import { getModuleContext } from '~/utils/context';
import { Status } from '~/components';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';
import { refreshActionsMap } from '~/redux/slices';

import { TextStyled } from './OrderContentTable.styled';
import { OrderFooter } from '../../footers';

export interface OrdersTableProps {
    order: OrderFull;
    loading: boolean;
}

export const OrderContentTable: FC<OrdersTableProps> = ({ order, loading }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const getActionData = useCallback(
        (line) => ({ line, url, order, baseRoute, privileges }),
        [url, order, baseRoute, privileges],
    );

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.synthesis?.table || SHORT_CONFIG_COLUMN__ORDER_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.synthesis?.lineActions || [];

    const defaultColumnsToProps: { [key in OrderContentTableDefaultColumns]?: ColumnProps<OrderLine> } = useMemo(
        () => ({
            IMAGE: {
                dataIndex: 'image_url',
                fixed: 'left',
                width: 80,
                render: (url: OrderLine['image_url']) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
            },
            ACTION: {
                title: '',
                align: 'center',
                width: 80,
                render: (line) => (
                    <CustomActions
                        data={getActionData(line)}
                        actionsConfig={actionsConfig}
                        refreshActionsMap={refreshActionsMap}
                        t={t}
                    />
                ),
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const columns: ColumnProps<OrderLine>[] = useColumnConfiguration(
        columnsConfiguration,
        order.currency,
        CONFIG_COLUMN__ORDER_DETAILS,
        defaultColumnsToProps,
        QA_ORDER_TABLE,
    );

    const createHeader = () => (
        <HeaderStyled>
            <Space>
                <TextStyled strong>{t('status_name.fulfillment')}</TextStyled>
                {order.cancelled_at ? (
                    <Status
                        className={QA_SYNTHESIS_PREPARATION_STATUS}
                        group="orderFulfillment"
                        code={OrderFulfillmentStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status
                        className={QA_SYNTHESIS_PREPARATION_STATUS}
                        group="orderFulfillment"
                        code={order?.fulfillment?.status}
                    />
                )}
                <Divider type="vertical" />
                <TextStyled strong>{t('status_name.shipment')}</TextStyled>
                {order.cancelled_at ? (
                    <Status
                        className={QA_SYNTHESIS_DELIVERY_STATUS}
                        group="orderShipment"
                        code={OrderShipmentStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status
                        className={QA_SYNTHESIS_DELIVERY_STATUS}
                        group="orderShipment"
                        code={order?.shipment?.status}
                    />
                )}
            </Space>
        </HeaderStyled>
    );

    const createFooter = () => <OrderFooter order={order} />;

    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableSimpleStyled
            rowKey="id"
            locale={locale}
            pagination={false}
            dataSource={order?.order_lines}
            loading={loading}
            columns={columns}
            title={createHeader}
            footer={createFooter}
            scroll={{ x: 1200 }}
        />
    );
};
