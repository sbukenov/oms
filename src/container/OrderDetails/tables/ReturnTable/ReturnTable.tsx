import React, { FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnProps } from 'antd/lib/table';
import { useSelector } from 'react-redux';
import { useColumnConfiguration, usePrivileges } from '@-bo/utils';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';

import { getModuleContext } from '~/utils';
import type { OrderReturn, OrderReturnTableDefaultColumns, ReturnItem, StatusCodes } from '~/models';
import { ReturnItemStatusCodes } from '~/models';
import {
    FIVE_LINES_HEIGHT,
    CONFIG_COLUMN__RETURN_DETAILS,
    SHORT_CONFIG_COLUMN__RETURN_DETAILS,
    QA_RETURN_TABLE,
} from '~/const';
import { Status } from '~/components';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';
import { selectOrderDetailsData } from '~/redux/selectors';
import { refreshActionsMap } from '~/redux/slices';

import { ReturnHeader } from '../../headers';

export interface ReturnTableProps {
    orderReturn: OrderReturn;
    currency: string;
    index: number;
}

export const ReturnTable: FC<ReturnTableProps> = ({ index, orderReturn, currency }) => {
    const { items } = orderReturn;

    const { t } = useTranslation();
    const privileges = usePrivileges(getModuleContext());
    const { baseRoute, config, url } = useContext(getModuleContext());

    const order = useSelector(selectOrderDetailsData);
    const getActionData = useCallback(
        (line) => ({ orderReturn, url, order, line, baseRoute, privileges }),
        [orderReturn, url, order, baseRoute, privileges],
    );

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.return?.table || SHORT_CONFIG_COLUMN__RETURN_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.return?.lineActions || [];

    const defaultColumnsToProps: { [key in OrderReturnTableDefaultColumns]?: ColumnProps<ReturnItem> } = {
        IMAGE: {
            dataIndex: ['order_line', 'image_url'],
            width: 80,
            render: (url: ReturnItem['order_line']['image_url']) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
        },
        STATUS: {
            title: t('order_return_detailed.table.status'),
            dataIndex: 'status',
            render: (status: StatusCodes) => {
                if (!!orderReturn?.cancelled_at) {
                    return <Status group="return" code={ReturnItemStatusCodes.CANCELLED} />;
                }
                return <Status group="return" code={status} />;
            },
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
    };

    const createHeader = useCallback(
        (orderReturn: OrderReturn, index: number) => () => <ReturnHeader index={index} orderReturn={orderReturn} />,
        [],
    );

    const columns: ColumnProps<ReturnItem>[] = useColumnConfiguration(
        columnsConfiguration,
        currency,
        CONFIG_COLUMN__RETURN_DETAILS,
        defaultColumnsToProps,
        `${QA_RETURN_TABLE}${index}`,
    );

    if (!items || !items.length) {
        return <HeaderStyled>{createHeader(orderReturn, index)()}</HeaderStyled>;
    }
    return (
        <TableSimpleStyled
            rowKey="id"
            pagination={false}
            dataSource={orderReturn.items}
            columns={columns}
            title={createHeader(orderReturn, index)}
            scroll={FIVE_LINES_HEIGHT}
        />
    );
};
