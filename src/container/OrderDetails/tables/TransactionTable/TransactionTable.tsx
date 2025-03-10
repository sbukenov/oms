import React, { FC, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { ColumnProps } from 'antd/lib/table';
import { CustomActions, EmptyImage } from '@-bo/keystone-components';
import { useColumnConfiguration, formatPrice, usePrivileges } from '@-bo/utils';

import { getModuleContext } from '~/utils';
import { ImageStyled, TableSimpleStyled, HeaderStyled } from '~/style/commonStyle';
import type {
    TransactionLine,
    TransactionFee,
    OrderTransactionTableDefaultColumns,
    Transaction,
    Price,
} from '~/models';
import {
    SHORT_CONFIG_COLUMN__TRANSACTION_DETAILS,
    CONFIG_COLUMN__TRANSACTION_DETAILS,
    FIVE_LINES_HEIGHT,
    TRANSACTION_LINE_ACTIONS,
    QA_TRANSACTION_TABLE,
} from '~/const';
import { selectOrderDetailsData } from '~/redux/selectors';
import { refreshActionsMap } from '~/redux/slices';

import { TransactionHeader } from '../../headers';
import { TransactionFooter } from '../../footers';

export interface TransactionTableProps {
    transaction: Transaction;
    currency: string;
    index: number;
}

export const TransactionTable: FC<TransactionTableProps> = ({ index, transaction, currency }) => {
    const { lines, fees } = transaction;
    const tableItems = [...lines, ...fees.map((fee) => ({ ...fee, isFee: true }))];

    const order = useSelector(selectOrderDetailsData);
    const privileges = usePrivileges(getModuleContext());
    const {
        t,
        i18n: { language },
    } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const getActionData = useCallback(
        (line) => ({ transaction, url, order, line, baseRoute, privileges }),
        [transaction, url, order, baseRoute, privileges],
    );

    const formatPriceWithCurrency = useCallback(
        (price: Price) => {
            return <span>{formatPrice(price, currency, language)}</span>;
        },
        [currency, language],
    );

    const columnsConfiguration =
        config?.specific?.orderDetails?.tabs?.transaction?.table || SHORT_CONFIG_COLUMN__TRANSACTION_DETAILS;
    const actionsConfig = config?.specific?.orderDetails?.tabs?.transaction?.lineActions || TRANSACTION_LINE_ACTIONS;

    const defaultColumnsToProps: {
        [key in OrderTransactionTableDefaultColumns]?: ColumnProps<TransactionLine | TransactionFee>;
    } = {
        IMAGE: {
            dataIndex: ['order_line', 'image_url'],
            width: 80,
            render: (url: TransactionLine['order_line']['image_url'], line) => {
                if ('isFee' in line && line.isFee) return null;
                return url ? <ImageStyled src={url} /> : <EmptyImage />;
            },
        },
        AMOUNT_EXCL_VAT: {
            title: t('order_transaction_detailed.table.amount_excl_VAT'),
            align: 'center',
            render: (_, { amount, amount_excluding_vat }: any) =>
                (!!amount && formatPriceWithCurrency(amount)) ||
                (!!amount_excluding_vat && formatPriceWithCurrency(amount_excluding_vat)),
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
        (transaction: Transaction, index: number) => () =>
            <TransactionHeader index={index} transaction={transaction} />,
        [],
    );

    const createFooter = useCallback(
        () => <TransactionFooter transaction={transaction} currency={currency} />,
        [transaction, currency],
    );

    const columns: ColumnProps<TransactionLine | TransactionFee>[] = useColumnConfiguration(
        columnsConfiguration,
        currency,
        CONFIG_COLUMN__TRANSACTION_DETAILS,
        defaultColumnsToProps,
        `${QA_TRANSACTION_TABLE}${index}`,
    );

    if (!tableItems || !tableItems.length) {
        return <HeaderStyled>{createHeader(transaction, index)()}</HeaderStyled>;
    }

    return (
        <TableSimpleStyled
            rowKey="id"
            pagination={false}
            dataSource={tableItems}
            columns={columns}
            title={createHeader(transaction, index)}
            footer={createFooter}
            scroll={FIVE_LINES_HEIGHT}
        />
    );
};
