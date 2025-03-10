import React, { FC, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ColumnProps } from 'antd/lib/table';
import { useColumnConfiguration } from '@-bo/utils';
import Empty from 'antd/lib/empty';
import Text from 'antd/lib/typography/Text';
import { useLocation } from 'react-router-dom';

import type {
    TransactionsTableDefaultColumns,
    TransactionTable,
    TransactionType,
    TransactionsTableColumn,
} from '~/models';
import { getModuleContext } from '~/utils';
import { TransactionStatusCodes } from '~/models';
import { Status } from '~/components';
import {
    ROUTE_ORDER,
    ROUTE_TRANSACTION,
    SHORT_CONFIG_COLUMN__TRANSACTION_LIST,
    CONFIG_COLUMN__TRANSACTION_LIST,
    DEFAULT_DASH,
    QA_TRANSACTIONS_TABLE,
} from '~/const';
import { StyledLink, TableStyled } from '~/style/commonStyle';

export interface TransactionsTableProps {
    transactions: TransactionTable[];
    loading: boolean;
    specialTabTable?: TransactionsTableColumn[];
}

export const TransactionsTable: FC<TransactionsTableProps> = ({ transactions, loading, specialTabTable }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());

    const columnsConfiguration =
        specialTabTable || config?.specific?.transactions?.table || SHORT_CONFIG_COLUMN__TRANSACTION_LIST;

    const handleRowClick = useCallback(
        (transaction: TransactionTable) => {
            return {
                onClick: () =>
                    navigate(`/${baseRoute}/${ROUTE_ORDER}/${transaction.order.id}/${ROUTE_TRANSACTION}`, {
                        state: { pathname },
                    }),
            };
        },
        [baseRoute, navigate, pathname],
    );

    const defaultColumnsToProps: { [key in TransactionsTableDefaultColumns]?: ColumnProps<TransactionTable> } = useMemo(
        () => ({
            REFERENCE: {
                title: t('transactions.table.reference'),
                dataIndex: 'reference',
                render: (reference: TransactionTable['reference'], transaction) =>
                    reference ? (
                        <StyledLink to={`/${baseRoute}/${ROUTE_ORDER}/${transaction.order.id}/${ROUTE_TRANSACTION}`}>
                            {reference}
                        </StyledLink>
                    ) : (
                        DEFAULT_DASH
                    ),
            },
            TYPE: {
                title: t('transactions.table.type'),
                dataIndex: 'type',
                render: (type: TransactionType) => (type ? <Text>{t(`type.Transaction.${type}`)}</Text> : DEFAULT_DASH),
            },
            STATUS: {
                title: t('transactions.table.status'),
                dataIndex: 'status',
                render: (statusCode: TransactionStatusCodes, { cancelled_at }: TransactionTable) =>
                    cancelled_at ? (
                        <Status group="transaction" code={TransactionStatusCodes.CANCELLED} />
                    ) : (
                        <Status group="transaction" code={statusCode} />
                    ),
            },
        }),
        [baseRoute, t],
    );

    const columns: ColumnProps<TransactionTable>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__TRANSACTION_LIST,
        defaultColumnsToProps,
        QA_TRANSACTIONS_TABLE,
    );
    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    return (
        <TableStyled
            rowKey="id"
            pagination={false}
            dataSource={transactions}
            loading={loading}
            columns={columns}
            locale={locale}
            onRow={handleRowClick}
        />
    );
};
