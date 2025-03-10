import React, { FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnProps } from 'antd/lib/table';
import { Icon } from '@-bo/component-library';
import { useColumnConfiguration, usePrivileges } from '@-bo/utils';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';

import { refreshActionsMap } from '~/redux/slices';
import { getModuleContext, mapFulfillmentItems } from '~/utils';
import type {
    FulfillmentItem,
    OrderFulfillmentTableDefaultColumns,
    Fulfillment,
    StatusCodes,
    OrderFull,
} from '~/models';
import { PickingStatusCodes, FulfillmentItemStatusCodes } from '~/models';
import { Status } from '~/components';
import {
    SHORT_CONFIG_COLUMN__FULFILLMENT_DETAILS,
    CONFIG_COLUMN__FULFILLMENT_DETAILS,
    FIVE_LINES_HEIGHT,
    DEFAULT_DASH,
    QA_PREPARATION_TABLE,
} from '~/const';
import { OverflowHiddenText, ImageStyled, HeaderStyled, TableSimpleStyled } from '~/style/commonStyle';

import { LabelStyled } from './PreparationTable.styled';
import { PreparationHeader } from '../../headers';

export interface PreparationTableProps {
    fulfillment: Fulfillment;
    currency: string;
    index: number;
    order?: OrderFull;
}

export const PreparationTable: FC<PreparationTableProps> = ({ fulfillment, currency, index, order }) => {
    const { fulfillment_items } = fulfillment;

    const { t } = useTranslation();
    const { config, baseRoute, url } = useContext(getModuleContext());

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.preparation?.table || SHORT_CONFIG_COLUMN__FULFILLMENT_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.preparation?.lineActions || [];
    const privileges = usePrivileges(getModuleContext());

    const getActionData = useCallback(
        (line) => ({ url, line, baseRoute, privileges, fulfillment, order }),
        [url, baseRoute, privileges, fulfillment, order],
    );

    const defaultColumnsToProps: { [key in OrderFulfillmentTableDefaultColumns]?: ColumnProps<FulfillmentItem> } = {
        IMAGE: {
            dataIndex: ['order_line', 'image_url'],
            width: 80,
            render: (url: FulfillmentItem['order_line']['image_url']) =>
                url ? <ImageStyled src={url} /> : <EmptyImage />,
        },
        LABEL: {
            title: t('order_fulfillment_detailed.table.product'),
            dataIndex: 'label',
            width: '25%',
            render: (label: string, fulfillmentItem) => (
                <LabelStyled>
                    {fulfillmentItem.isSubstitute && <Icon name="substitution" />}
                    <OverflowHiddenText>{label}</OverflowHiddenText>
                </LabelStyled>
            ),
        },
        STATUS: {
            title: t('order_fulfillment_detailed.table.preparation_status'),
            dataIndex: 'completion',
            render: (status: StatusCodes, fulfillmentItem) => {
                if (!!fulfillment?.cancelled_at) {
                    return <Status group="fulfillmentItem" code={FulfillmentItemStatusCodes.CANCELLED} />;
                }
                if (fulfillmentItem.isSubstitute) {
                    return <Status group="picking" code={PickingStatusCodes.SUBSTITUTE} />;
                }
                return <Status group="fulfillmentItem" code={status} />;
            },
        },
        ORDERED: {
            title: t('order_fulfillment_detailed.table.ordered'),
            dataIndex: ['quantity', 'quantity'],
            align: 'center',
            render: (quantity: number, fulfillmentItem) =>
                fulfillmentItem.isSubstitute ? DEFAULT_DASH : quantity || DEFAULT_DASH,
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
        (fulfillment: Fulfillment, index: number) => () =>
            <PreparationHeader fulfillment={fulfillment} index={index} />,
        [],
    );

    const columns: ColumnProps<FulfillmentItem>[] = useColumnConfiguration(
        columnsConfiguration,
        currency,
        CONFIG_COLUMN__FULFILLMENT_DETAILS,
        defaultColumnsToProps,
        `${QA_PREPARATION_TABLE}${index}`,
    );

    if (!fulfillment_items || !fulfillment_items.length) {
        return <HeaderStyled>{createHeader(fulfillment, index)()}</HeaderStyled>;
    }
    return (
        <TableSimpleStyled
            rowKey="id"
            pagination={false}
            dataSource={mapFulfillmentItems(fulfillment_items)}
            columns={columns}
            title={createHeader(fulfillment, index)}
            scroll={FIVE_LINES_HEIGHT}
        />
    );
};
