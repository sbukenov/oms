import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import type { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import { useColumnConfiguration } from '@bo/utils';

import type { OrdersTableDefaultColumns, Order, StatusCodes, OrdersTableColumn } from '~/models';
import { OrderFulfillmentStatusCodes, OrderShipmentStatusCodes, OrderStatusCodes } from '~/models';
import { getModuleContext } from '~/utils';
import { SHORT_CONFIG_COLUMN__ORDER_LIST, CONFIG_COLUMN__ORDER_LIST, ROUTE_ORDER, QA_ORDERS_TABLE } from '~/const';
import { Status } from '~/components';
import { StyledLink, TableStyled } from '~/style/commonStyle';

export interface OrdersTableProps {
    orders: Order[];
    loading: boolean;
    specialTabTable?: OrdersTableColumn[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, loading, specialTabTable }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());

    const columnsConfiguration = specialTabTable || config?.specific?.orders?.table || SHORT_CONFIG_COLUMN__ORDER_LIST;

    const handleRowClick = useCallback(
        (order: Order) => {
            return {
                onClick: () => navigate(`/${baseRoute}/${ROUTE_ORDER}/${order.id}`, { state: { pathname } }),
            };
        },
        [baseRoute, navigate, pathname],
    );

    const defaultColumnsToProps: { [key in OrdersTableDefaultColumns]?: ColumnProps<Order> } = useMemo(
        () => ({
            REFERENCE: {
                title: t('orders.table.reference'),
                dataIndex: 'reference',
                width: '15%',
                render: (reference: Order['reference'], order) => (
                    <StyledLink to={`/${baseRoute}/${ROUTE_ORDER}/${order.id}`}>{reference}</StyledLink>
                ),
            },
            STATUS: {
                title: t('orders.table.status'),
                dataIndex: 'status',
                render: (statusCode: StatusCodes, { cancelled_at }: Order) =>
                    cancelled_at ? (
                        <Status group="order" code={OrderStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="order" code={statusCode} />
                    ),
            },
            FULFILLMENT_STATUS: {
                title: t('orders.table.fulfillment_status'),
                dataIndex: ['fulfillment', 'status'],
                render: (statusCode: StatusCodes, { cancelled_at }: Order) =>
                    cancelled_at ? (
                        <Status group="orderFulfillment" code={OrderFulfillmentStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="orderFulfillment" code={statusCode} />
                    ),
            },
            SHIPMENT_STATUS: {
                title: t('orders.table.shipment_status'),
                dataIndex: ['shipment', 'status'],
                render: (statusCode: StatusCodes, { cancelled_at }: Order) =>
                    cancelled_at ? (
                        <Status group="orderShipment" code={OrderShipmentStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="orderShipment" code={statusCode} />
                    ),
            },
        }),
        [baseRoute, t],
    );

    const columns: ColumnProps<Order>[] = useColumnConfiguration(
        columnsConfiguration,
        orders[0]?.currency,
        CONFIG_COLUMN__ORDER_LIST,
        defaultColumnsToProps,
        QA_ORDERS_TABLE,
    );
    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableStyled
            rowKey="id"
            pagination={false}
            dataSource={orders}
            loading={loading}
            columns={columns}
            onRow={handleRowClick}
            locale={locale}
        />
    );
};
