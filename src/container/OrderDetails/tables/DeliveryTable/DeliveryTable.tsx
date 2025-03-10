import React, { FC, useCallback, useContext } from 'react';
import type { ColumnProps } from 'antd/lib/table';
import { useColumnConfiguration, usePrivileges } from '@-bo/utils';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';
import { useTranslation } from 'react-i18next';

import { getModuleContext } from '~/utils';
import type { ShipmentItem, OrderShipment, OrderShipmentTableDefaultColumns, OrderFull } from '~/models';
import {
    FIVE_LINES_HEIGHT,
    CONFIG_COLUMN__SHIPMENT_DETAILS,
    SHORT_CONFIG_COLUMN__SHIPMENT_DETAILS,
    QA_DELIVERY_TABLE,
} from '~/const';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';
import { refreshActionsMap } from '~/redux/slices';

import { DeliveryHeader } from '../../headers';

export interface DeliveryTableProps {
    shipment: OrderShipment;
    order: OrderFull;
    index: number;
}

export const DeliveryTable: FC<DeliveryTableProps> = ({ shipment, order, index }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const { id, items } = shipment;
    const getActionData = useCallback(
        (line) => ({ shipment, order, url, line, baseRoute, privileges }),
        [shipment, order, url, baseRoute, privileges],
    );

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.delivery?.table || SHORT_CONFIG_COLUMN__SHIPMENT_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.delivery?.lineActions || [];

    const defaultColumnsToProps: { [key in OrderShipmentTableDefaultColumns]?: ColumnProps<ShipmentItem> } = {
        IMAGE: {
            dataIndex: ['order_line', 'image_url'],
            width: 80,
            render: (url: ShipmentItem['order_line']['image_url']) =>
                url ? <ImageStyled src={url} /> : <EmptyImage />,
        },
        ACTION: {
            title: '',
            align: 'center',
            width: 80,
            render: (line) => (
                <CustomActions
                    actionsConfig={actionsConfig}
                    data={getActionData(line)}
                    refreshActionsMap={refreshActionsMap}
                    t={t}
                />
            ),
        },
    };

    const columns: ColumnProps<ShipmentItem>[] = useColumnConfiguration(
        columnsConfiguration,
        order.currency,
        CONFIG_COLUMN__SHIPMENT_DETAILS,
        defaultColumnsToProps,
        `${QA_DELIVERY_TABLE}${index}`,
    );

    const createHeader = (shipment: OrderShipment, index: number) => () =>
        <DeliveryHeader shipment={shipment} index={index} />;

    if (!items?.length) {
        return <HeaderStyled key={id}>{createHeader(shipment, index)()}</HeaderStyled>;
    }

    return (
        <TableSimpleStyled
            key={id}
            rowKey="id"
            pagination={false}
            dataSource={items}
            columns={columns}
            title={createHeader(shipment, index)}
            scroll={FIVE_LINES_HEIGHT}
        />
    );
};
