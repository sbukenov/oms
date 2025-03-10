import React, { FC, useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import { useLocation } from 'react-router-dom';
import { useColumnConfiguration } from '@-bo/utils';

import type { ShipmentsTableDefaultColumns, StatusCodes, Shipment, ShipmentsTableColumn } from '~/models';
import { ShipmentStatusCodes } from '~/models';
import {
    SHORT_CONFIG_COLUMN__SHIPMENT_LIST,
    CONFIG_COLUMN__SHIPMENT_LIST,
    DEFAULT_DASH,
    ROUTE_ORDER,
    ROUTE_DELIVERY,
    QA_DELIVERIES_TABLE,
} from '~/const';
import { Status } from '~/components';
import { getModuleContext } from '~/utils';
import { StyledLink, TableStyled } from '~/style/commonStyle';

import { ButtonStyled } from './DeliveriesTable.styled';

export interface DeliveriesTableProps {
    shipments: Shipment[];
    loading: boolean;
    specialTabTable?: ShipmentsTableColumn[];
}

export const DeliveriesTable: FC<DeliveriesTableProps> = ({ shipments, loading, specialTabTable }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());

    const columnsConfiguration =
        specialTabTable || config?.specific?.deliveries?.table || SHORT_CONFIG_COLUMN__SHIPMENT_LIST;

    const handleRowClick = useCallback(
        (shipment: Shipment) => {
            return {
                onClick: () =>
                    navigate(`/${baseRoute}/${ROUTE_ORDER}/${shipment.order.id}/${ROUTE_DELIVERY}`, {
                        state: { pathname },
                    }),
            };
        },
        [baseRoute, navigate, pathname],
    );

    const defaultColumnsToProps: { [key in ShipmentsTableDefaultColumns]?: ColumnProps<Shipment> } = useMemo(
        () => ({
            REFERENCE: {
                title: t('shipments.table.reference'),
                dataIndex: 'reference',
                render: (reference: Shipment['reference'], shipment) =>
                    reference ? (
                        <StyledLink to={`/${baseRoute}/${ROUTE_ORDER}/${shipment.order.id}/${ROUTE_DELIVERY}`}>
                            {reference}
                        </StyledLink>
                    ) : (
                        DEFAULT_DASH
                    ),
            },
            STATUS: {
                title: t('shipments.table.status'),
                dataIndex: 'status',
                render: (statusCode: StatusCodes, { cancelled_at }: Shipment) =>
                    cancelled_at ? (
                        <Status group="shipment" code={ShipmentStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="shipment" code={statusCode} />
                    ),
            },
            TRACKING_LINK: {
                title: t('shipments.table.tracking_link'),
                dataIndex: 'tracking_link',
                render: (trackingLink: string) =>
                    trackingLink ? (
                        <ButtonStyled
                            type="link"
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(trackingLink);
                            }}
                        >
                            {t('common.tracking_ID')}
                        </ButtonStyled>
                    ) : (
                        DEFAULT_DASH
                    ),
            },
        }),
        [baseRoute, t],
    );

    const columns: ColumnProps<Shipment>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__SHIPMENT_LIST,
        defaultColumnsToProps,
        QA_DELIVERIES_TABLE,
    );
    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableStyled
            rowKey="id"
            pagination={false}
            dataSource={shipments}
            loading={loading}
            columns={columns}
            locale={locale}
            onRow={handleRowClick}
        />
    );
};
