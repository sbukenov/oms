import React, { FC, useContext, useMemo } from 'react';
import get from 'lodash/get';
import Table from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { getRawAmountValue, useLineConfiguration, showPriceWithCurrency } from '@bo/utils';

import type {
    ReceptionQuantitiesById,
    ReplenishmentOperation,
    ReceptionDetailsTableColumn,
    LogisticUnit,
    UnexpectedLogisticUnit,
} from '~/models';
import { getModuleContext } from '~/utils';
import { SHORT_CONFIG_AMOUNTS__RECEPTION_DETAILS, DEFAULT_DASH } from '~/const';

interface ReceptionFooterProps {
    parentColumns: ReceptionDetailsTableColumn[];
    reception?: ReplenishmentOperation;
    quantitiesById: ReceptionQuantitiesById;
    dataSource?: (LogisticUnit | UnexpectedLogisticUnit)[];
    currency: string;
}

export const ReceptionCreationFooter: FC<ReceptionFooterProps> = ({
    parentColumns,
    reception,
    quantitiesById,
    dataSource,
    currency,
}) => {
    const { t, i18n } = useTranslation();
    const { config } = useContext(getModuleContext());

    const totalAmounts = config.specific?.receptionDetails?.totalAmounts || SHORT_CONFIG_AMOUNTS__RECEPTION_DETAILS;

    const totalQuantities = useMemo(() => {
        return dataSource?.reduce(
            (acc, item) => {
                const priceValue = quantitiesById[item.id]?.price || item.price;
                const price = typeof priceValue === 'number' ? priceValue : getRawAmountValue(priceValue);

                acc['ordered'] += item.packaging.quantity || 0;
                acc['received'] += quantitiesById[item.id]?.received ?? (item.packaging.quantity || 0);
                acc['damaged'] += quantitiesById[item.id]?.damaged || 0;
                acc['missing'] += quantitiesById[item.id]?.missing || 0;
                acc['intitalTotalAmount'] += getRawAmountValue(item.initial_total_amount) || 0;
                acc['receivedTotalAmount'] +=
                    price * (quantitiesById[item.id]?.received ?? (item.packaging.quantity || 0));
                return acc;
            },
            { ordered: 0, received: 0, damaged: 0, missing: 0, intitalTotalAmount: 0, receivedTotalAmount: 0 },
        );
    }, [dataSource, quantitiesById]);

    const defaultLines = useMemo(
        () => ({
            ORDERED: {
                title: t('reception_details.ordered'),
                parentColumn: 'ORDERED',
                render: () => <>{totalQuantities?.ordered}</>,
            },
            RECEIVED: {
                title: t('reception_details.received'),
                parentColumn: 'RECEIVED',
                render: () => <>{totalQuantities?.received}</>,
            },
            DAMAGED: {
                title: t('reception_details.damaged'),
                parentColumn: 'DAMAGED',
                render: () => <>{totalQuantities?.damaged}</>,
            },
            MISSING: {
                title: t('reception_details.missing'),
                parentColumn: 'MISSING',
                render: () => <>{totalQuantities?.missing}</>,
            },
            TOTAL_AMOUNT: {
                title: t('reception_details.total_amount'),
                parentColumn: 'TOTAL_AMOUNT',
                render: () => (
                    <>
                        {!!totalQuantities?.intitalTotalAmount
                            ? showPriceWithCurrency(
                                  totalQuantities?.intitalTotalAmount,
                                  currency,
                                  i18n.resolvedLanguage,
                              )
                            : DEFAULT_DASH}
                    </>
                ),
            },
            TOTAL_RECEIVED_AMOUNT: {
                title: t('reception_details.total_received_amount'),
                parentColumn: 'TOTAL_RECEIVED_AMOUNT',
                render: () => (
                    <>
                        {!!totalQuantities?.receivedTotalAmount
                            ? showPriceWithCurrency(
                                  totalQuantities?.receivedTotalAmount,
                                  currency,
                                  i18n.resolvedLanguage,
                              )
                            : DEFAULT_DASH}
                    </>
                ),
            },
        }),
        [currency, i18n.resolvedLanguage, t, totalQuantities],
    );

    const amounts = useLineConfiguration(totalAmounts, currency, {}, defaultLines);

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
                        <Table.Summary.Cell key={index} index={index} colSpan={2}>
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
