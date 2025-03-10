import React, { FC, useCallback, useContext, useMemo } from 'react';
import type { ColumnProps } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Empty } from 'antd';
import { useColumnConfiguration, usePrivileges } from '@-bo/utils';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';

import type { OrderFull, OrderLine, OrderReplenishmentTableDefaultColumns } from '~/models';
import {
    SHORT_CONFIG_COLUMN__REPLENISHMENT_DETAILS,
    CONFIG_COLUMN__REPLENISHMENT_DETAILS,
    QA_REPLENISHMENT_TABLE,
    DEFAULT_DASH,
} from '~/const';
import { getModuleContext } from '~/utils/context';
import { ImageStyled, TableSimpleStyled } from '~/style/commonStyle';
import { refreshActionsMap } from '~/redux/slices';

import { OrderFooter } from '../../footers';

export interface OrderReplenishmentTableProps {
    order: OrderFull;
    loading: boolean;
}

export const OrderReplenishmentTable: FC<OrderReplenishmentTableProps> = ({ order, loading }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());

    const getActionData = useCallback(
        (line) => ({ line, url, order, baseRoute, privileges }),
        [url, order, baseRoute, privileges],
    );

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.order?.table || SHORT_CONFIG_COLUMN__REPLENISHMENT_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.order?.lineActions || [];

    const defaultColumnsToProps: { [key in OrderReplenishmentTableDefaultColumns]?: ColumnProps<OrderLine> } = useMemo(
        () => ({
            IMAGE: {
                dataIndex: ['packaging', 'product', 'image_url'],
                fixed: 'left',
                width: 80,
                render: (url: OrderLine['image_url']) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
            },
            TOTAL_OUTER: {
                width: 80,
                title: t('order_creation.product_table.total_quantity'),
                render: (order) => order?.quantity * order?.packaging?.product_per_packaging || DEFAULT_DASH,
            },
            ACTION: {
                title: '',
                align: 'center',
                width: 80,
                render: (line: OrderLine) => (
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
        CONFIG_COLUMN__REPLENISHMENT_DETAILS,
        defaultColumnsToProps,
        QA_REPLENISHMENT_TABLE,
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
            footer={createFooter}
            scroll={{ x: 1200 }}
        />
    );
};
