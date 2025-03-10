import React, { FC, useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import type { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import { useColumnConfiguration } from '@bo/utils';

import type { FulfillmentsTableDefaultColumns, StatusCodes, Fulfillment, FulfillmentsTableColumn } from '~/models';
import { FulfillmentStatusCodes } from '~/models';
import {
    SHORT_CONFIG_COLUMN__FULFILLMENT_LIST,
    CONFIG_COLUMN__FULFILLMENT_LIST,
    DEFAULT_DASH,
    ROUTE_ORDER,
    ROUTE_PREPARATION,
    QA_FULFILLMENTS_TABLE,
} from '~/const';
import { Status } from '~/components';
import { getModuleContext } from '~/utils';
import { StyledLink, TableStyled } from '~/style/commonStyle';

export interface FulfillmentsTableProps {
    fulfillments: Fulfillment[];
    loading: boolean;
    specialTabTable?: FulfillmentsTableColumn[];
}

export const FulfillmentsTable: FC<FulfillmentsTableProps> = ({ fulfillments, loading, specialTabTable }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());

    const columnsConfiguration =
        specialTabTable || config?.specific?.preparations?.table || SHORT_CONFIG_COLUMN__FULFILLMENT_LIST;

    const handleRowClick = useCallback(
        (fulfillment: Fulfillment) => {
            return {
                onClick: () =>
                    navigate(`/${baseRoute}/${ROUTE_ORDER}/${fulfillment.order.id}/${ROUTE_PREPARATION}`, {
                        state: { pathname },
                    }),
            };
        },
        [baseRoute, navigate, pathname],
    );

    const defaultColumnsToProps: { [key in FulfillmentsTableDefaultColumns]?: ColumnProps<Fulfillment> } = useMemo(
        () => ({
            REFERENCE: {
                title: t('fulfillments.table.reference'),
                dataIndex: 'reference',
                render: (reference: Fulfillment['reference'], fulfillment) =>
                    reference ? (
                        <StyledLink to={`/${baseRoute}/${ROUTE_ORDER}/${fulfillment.order.id}/${ROUTE_PREPARATION}`}>
                            {reference}
                        </StyledLink>
                    ) : (
                        DEFAULT_DASH
                    ),
            },
            STATUS: {
                title: t('fulfillments.table.status'),
                dataIndex: 'status',
                render: (statusCode: StatusCodes, { cancelled_at }: Fulfillment) =>
                    cancelled_at ? (
                        <Status group="fulfillment" code={FulfillmentStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="fulfillment" code={statusCode} />
                    ),
            },
        }),
        [baseRoute, t],
    );

    const columns: ColumnProps<Fulfillment>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__FULFILLMENT_LIST,
        defaultColumnsToProps,
        QA_FULFILLMENTS_TABLE,
    );
    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableStyled
            rowKey="id"
            pagination={false}
            dataSource={fulfillments}
            loading={loading}
            columns={columns}
            locale={locale}
            onRow={handleRowClick}
        />
    );
};
