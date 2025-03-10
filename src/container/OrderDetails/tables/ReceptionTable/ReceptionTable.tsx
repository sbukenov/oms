import React, { FC, useCallback, useContext } from 'react';
import Table, { ColumnProps } from 'antd/lib/table';
import { useColumnConfiguration } from '@bo/utils';
import { EmptyImage } from '@-bo/keystone-components';

import { getModuleContext } from '~/utils';
import type { OrderReceptionTableDefaultColumns, ReplenishmentOperation, LogisticUnit } from '~/models';
import {
    SHORT_CONFIG_COLUMN__RECEPTION_DETAILS,
    CONFIG_COLUMN__RECEPTION_DETAILS,
    FIVE_LINES_HEIGHT,
    QA_RECEPTION_TABLE,
} from '~/const';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';

import { ReceptionHeader } from '../../headers';
import { ReceptionFooter } from '../../footers';

export interface ReplenishmentOperationProps {
    reception: ReplenishmentOperation;
    currency: string;
    index: number;
}

export const ReceptionTable: FC<ReplenishmentOperationProps> = ({ reception, currency, index }) => {
    const { logistic_units } = reception;

    const { config } = useContext(getModuleContext());

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.reception?.table || SHORT_CONFIG_COLUMN__RECEPTION_DETAILS;

    const defaultColumnsToProps: { [key in OrderReceptionTableDefaultColumns]?: ColumnProps<LogisticUnit> } = {
        IMAGE: {
            dataIndex: ['logistic_unit_items', '0', 'image_url'],
            width: 80,
            render: (url: LogisticUnit['logistic_unit_items'][0]['image_url']) =>
                url ? <ImageStyled src={url} /> : <EmptyImage />,
        },
    };

    const createHeader = useCallback(
        (reception: ReplenishmentOperation, index: number) => () =>
            <ReceptionHeader reception={reception} index={index} />,
        [],
    );

    const columns: ColumnProps<LogisticUnit>[] = useColumnConfiguration(
        columnsConfiguration,
        currency,
        CONFIG_COLUMN__RECEPTION_DETAILS,
        defaultColumnsToProps,
        `${QA_RECEPTION_TABLE}${index}`,
    );

    if (!logistic_units || !logistic_units.length) {
        return <HeaderStyled>{createHeader(reception, index)()}</HeaderStyled>;
    }

    return (
        <TableSimpleStyled
            rowKey="id"
            pagination={false}
            dataSource={logistic_units}
            columns={columns}
            title={createHeader(reception, index)}
            scroll={FIVE_LINES_HEIGHT}
            summary={() => (
                <Table.Summary fixed>
                    <ReceptionFooter parentColumns={columnsConfiguration} reception={reception} currency={currency} />
                </Table.Summary>
            )}
        />
    );
};
