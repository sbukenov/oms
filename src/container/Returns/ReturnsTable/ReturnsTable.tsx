import React, { FC, useMemo, useCallback, useContext } from 'react';
import type { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import { useTranslation } from 'react-i18next';
import { useColumnConfiguration } from '@bo/utils';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { ReturnStatusCodes } from '~/models';
import type { ReturnsTableDefaultColumns, StatusCodes, OrderReturn, ReturnsTableColumn } from '~/models';
import {
    SHORT_CONFIG_COLUMN__RETURN_LIST,
    CONFIG_COLUMN__RETURN_LIST,
    DEFAULT_DASH,
    ROUTE_ORDER,
    ROUTE_RETURN,
    QA_RETURNS_TABLE,
} from '~/const';
import { Status } from '~/components';
import { getModuleContext } from '~/utils';
import { StyledLink, TableStyled } from '~/style/commonStyle';

export interface ReturnsTableProps {
    returns: OrderReturn[];
    loading: boolean;
    specialTabTable?: ReturnsTableColumn[];
}

export const ReturnsTable: FC<ReturnsTableProps> = ({ returns, loading, specialTabTable }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());

    const columnsConfiguration =
        specialTabTable || config?.specific?.returns?.table || SHORT_CONFIG_COLUMN__RETURN_LIST;

    const handleRowClick = useCallback(
        (orderReturn: OrderReturn) => {
            return {
                onClick: () =>
                    navigate(`/${baseRoute}/${ROUTE_ORDER}/${orderReturn.order.id}/${ROUTE_RETURN}`, {
                        state: { pathname },
                    }),
            };
        },
        [baseRoute, navigate, pathname],
    );

    const defaultColumnsToProps: { [key in ReturnsTableDefaultColumns]?: ColumnProps<OrderReturn> } = useMemo(
        () => ({
            REFERENCE: {
                title: t('returns.table.reference'),
                dataIndex: 'merchant_ref',
                render: (reference: OrderReturn['merchant_ref'], orderReturn) =>
                    reference ? (
                        <StyledLink to={`/${baseRoute}/${ROUTE_ORDER}/${orderReturn.order.id}/${ROUTE_RETURN}`}>
                            {reference}
                        </StyledLink>
                    ) : (
                        DEFAULT_DASH
                    ),
            },
            OWNER: {
                title: t('returns.table.owner'),
                dataIndex: ['owner', 'label'],
                width: '25%',
            },
            STATUS: {
                title: t('returns.table.status'),
                dataIndex: 'status',
                render: (statusCode: StatusCodes, { cancelled_at }: OrderReturn) =>
                    cancelled_at ? (
                        <Status group="return" code={ReturnStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="return" code={statusCode} />
                    ),
            },
        }),
        [baseRoute, t],
    );

    const columns: ColumnProps<OrderReturn>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__RETURN_LIST,
        defaultColumnsToProps,
        QA_RETURNS_TABLE,
    );
    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableStyled
            rowKey="id"
            pagination={false}
            dataSource={returns}
            loading={loading}
            columns={columns}
            locale={locale}
            onRow={handleRowClick}
        />
    );
};
