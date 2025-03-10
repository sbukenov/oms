import React, { FC, useCallback, useContext } from 'react';
import Table, { ColumnProps } from 'antd/lib/table';
import { useColumnConfiguration } from '@-bo/utils';
import { EmptyImage } from '@-bo/keystone-components';

import { getModuleContext } from '~/utils';
import type { OrderExpeditionTableDefaultColumns, ReplenishmentOperation, LogisticUnit } from '~/models';
import {
    SHORT_CONFIG_COLUMN__EXPEDITION_DETAILS,
    CONFIG_COLUMN__EXPEDITION_DETAILS,
    FIVE_LINES_HEIGHT,
    QA_RECEPTION_TABLE,
} from '~/const';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';

import { ExpeditionHeader } from '../../headers';
import { ExpeditionFooter } from '../../footers';

export interface ExpeditionTableProps {
    expedition: ReplenishmentOperation;
    currency: string;
    index: number;
}

export const ExpeditionTable: FC<ExpeditionTableProps> = ({ expedition, currency, index }) => {
    const { logistic_units } = expedition;

    const { config } = useContext(getModuleContext());

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.expedition?.table || SHORT_CONFIG_COLUMN__EXPEDITION_DETAILS;

    const defaultColumnsToProps: { [key in OrderExpeditionTableDefaultColumns]?: ColumnProps<LogisticUnit> } = {
        IMAGE: {
            dataIndex: ['logistic_unit_items', '0', 'image_url'],
            width: 80,
            render: (url: LogisticUnit['logistic_unit_items']['0']['image_url']) =>
                url ? <ImageStyled src={url} /> : <EmptyImage />,
        },
    };

    const createHeader = useCallback(
        (expedition: ReplenishmentOperation, index: number) => () =>
            <ExpeditionHeader expedition={expedition} index={index} />,
        [],
    );

    const columns: ColumnProps<LogisticUnit>[] = useColumnConfiguration(
        columnsConfiguration,
        currency,
        CONFIG_COLUMN__EXPEDITION_DETAILS,
        defaultColumnsToProps,
        `${QA_RECEPTION_TABLE}${index}`,
    );

    if (!logistic_units || !logistic_units.length) {
        return <HeaderStyled>{createHeader(expedition, index)()}</HeaderStyled>;
    }
    return (
        <TableSimpleStyled
            rowKey="id"
            pagination={false}
            dataSource={logistic_units}
            columns={columns}
            title={createHeader(expedition, index)}
            scroll={FIVE_LINES_HEIGHT}
            summary={() => (
                <Table.Summary fixed>
                    <ExpeditionFooter
                        parentColumns={columnsConfiguration}
                        expedition={expedition}
                        currency={currency}
                    />
                </Table.Summary>
            )}
        />
    );
};
