import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { DEFAULT_CURRENCY, IdParam } from '@bo/utils';

import { useActions } from '~/hooks';
import { SpinStyled } from '~/style/commonStyle';
import { getModuleContext } from '~/utils';
import { expeditionsActions } from '~/redux/slices';
import { selectOrderExpeditions, selectOrderDetails } from '~/redux/selectors';
import { EmptyState } from '~/components';

import { CommentPanel } from '../../comments';
import { ExpeditionTable } from '../../tables';

export const ExpeditionTab: FC = () => {
    const { id } = useParams<IdParam>();
    const { expeditions, orderId, loading: isExpeditionsLoading } = useSelector(selectOrderExpeditions);
    const { loading: isOrderDetailsLoading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderExpeditionsRequest } = useActions(expeditionsActions);
    const { t } = useTranslation();
    const { config } = useContext(getModuleContext());

    const displayComments = !!config?.specific?.orderDetails?.tabs?.reception?.displayComments ?? true;

    useEffect(() => {
        id && !isExpeditionsLoading && id !== orderId && getOrderExpeditionsRequest(id);
        // eslint-disable-next-line
    }, [id, orderId, getOrderExpeditionsRequest]);

    if (isExpeditionsLoading || isOrderDetailsLoading) {
        return <SpinStyled />;
    }

    const comments = displayComments && <CommentPanel commentsCount={orderDetails?.comments.length} />;

    if (!expeditions?.length)
        return (
            <>
                <EmptyState
                    title={t('order_expedition_detailed.empty.title')}
                    subtitle={t('order_expedition_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {expeditions?.map((expedition, index) => (
                <ExpeditionTable
                    expedition={expedition}
                    key={expedition.id}
                    index={index}
                    currency={orderDetails?.currency || DEFAULT_CURRENCY}
                />
            ))}
            {comments}
        </>
    );
};
