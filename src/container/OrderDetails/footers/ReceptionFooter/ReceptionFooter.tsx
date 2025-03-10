import React, { FC, useContext, useMemo } from 'react';
import get from 'lodash/get';
import Table from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useLineConfiguration } from '@-bo/utils';

import type { ReplenishmentOperation, OrderReceptionTableColumn } from '~/models';
import { getModuleContext } from '~/utils';
import { CONFIG_AMOUNTS__RECEPTION, SHORT_CONFIG_AMOUNTS__RECEPTION } from '~/const';

interface ReceptionFooterProps {
    parentColumns: OrderReceptionTableColumn[];
    reception: ReplenishmentOperation;
    currency: string;
}

export const ReceptionFooter: FC<ReceptionFooterProps> = ({ parentColumns, reception, currency }) => {
    const { t } = useTranslation();
    const { config } = useContext(getModuleContext());

    const totalAmounts =
        config?.specific?.orderDetails?.tabs?.reception?.totalAmounts || SHORT_CONFIG_AMOUNTS__RECEPTION;

    const amounts = useLineConfiguration(totalAmounts, currency, CONFIG_AMOUNTS__RECEPTION);
    const normalizedAmount = useMemo(
        () =>
            amounts.reduce(
                (acc, curAmount) => ({
                    ...acc,
                    [curAmount.parentColumn]: curAmount,
                }),
                {},
            ),
        [amounts],
    );

    if (!amounts.length) {
        return null;
    }
    return (
        <Table.Summary.Row>
            {parentColumns.map((parentColumn, index) => {
                if (index === 0) {
                    return (
                        <Table.Summary.Cell key={index} index={index}>
                            {t('common.total')}
                        </Table.Summary.Cell>
                    );
                }
                const amount = !!parentColumn.column && normalizedAmount[parentColumn.column];
                if (!amount) {
                    return <Table.Summary.Cell key={index} index={index} />;
                }
                const itemData = get(reception, amount.path);
                const result = amount.render ? amount.render(itemData, amount, index) : itemData;
                return (
                    <Table.Summary.Cell key={index} index={index}>
                        {result}
                    </Table.Summary.Cell>
                );
            })}
        </Table.Summary.Row>
    );
};
