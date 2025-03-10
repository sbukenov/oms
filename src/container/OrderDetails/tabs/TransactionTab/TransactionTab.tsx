import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { usePrivileges, IdParam } from '@bo/utils';

import { useActions } from '~/hooks';
import { getModuleContext, redirectToFirstAvailableTab } from '~/utils';
import { transactionsActions } from '~/redux/slices';
import { selectOrderDetails, selectOrderTransactions } from '~/redux/selectors';
import { SpinStyled } from '~/style/commonStyle';
import { EmptyState } from '~/components';
import { PRIVILEGE_TRANSACTION_TAB } from '~/const';

import { CommentPanel } from '../../comments';
import { TransactionTable } from '../../tables';

export const TransactionTab: FC = () => {
    const { id } = useParams<IdParam>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const { transactions, loading: isTransactionsLoading, orderId } = useSelector(selectOrderTransactions);
    const { loading: isOrderDetailsLoading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderTransactionsRequest } = useActions(transactionsActions);

    const displayComments = !!config?.specific?.orderDetails?.tabs?.transaction?.displayComments ?? true;

    useEffect(() => {
        if (!privileges?.size || !id || privileges.has(PRIVILEGE_TRANSACTION_TAB)) return;

        redirectToFirstAvailableTab({ baseRoute, id, privileges, navigate, t });

        // to exclude "navigate"
        // eslint-disable-next-line
    }, [baseRoute, id, privileges, t]);

    useEffect(() => {
        id &&
            privileges?.has(PRIVILEGE_TRANSACTION_TAB) &&
            !isTransactionsLoading &&
            id !== orderId &&
            getOrderTransactionsRequest(id);
        // eslint-disable-next-line
    }, [id, orderId, getOrderTransactionsRequest, orderId]);

    if (isTransactionsLoading || isOrderDetailsLoading) {
        return <SpinStyled />;
    }

    const comments = displayComments && <CommentPanel commentsCount={orderDetails?.comments.length} />;

    if (!transactions?.items?.length || !orderDetails)
        return (
            <>
                <EmptyState
                    title={t('order_transaction_detailed.empty.title')}
                    subtitle={t('order_transaction_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {transactions.items.map((transaction, index) => (
                <TransactionTable
                    index={index}
                    transaction={transaction}
                    key={transaction.id}
                    currency={orderDetails.currency}
                />
            ))}
            {comments}
        </>
    );
};
