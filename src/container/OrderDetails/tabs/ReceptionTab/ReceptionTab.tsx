import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { DEFAULT_CURRENCY, IdParam } from '@-bo/utils';

import { useActions } from '~/hooks';
import { SpinStyled } from '~/style/commonStyle';
import { getModuleContext } from '~/utils';
import { receptionsActions } from '~/redux/slices';
import { selectOrderReceptions, selectOrderDetails } from '~/redux/selectors';
import { EmptyState } from '~/components';

import { CommentPanel } from '../../comments';
import { ReceptionTable } from '../../tables';

export const ReceptionTab: FC = () => {
    const { id } = useParams<IdParam>();
    const { receptions, orderId, loading: isReceptionsLoading } = useSelector(selectOrderReceptions);
    const { loading: isOrderDetailsLoading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderReceptionsRequest } = useActions(receptionsActions);
    const { t } = useTranslation();
    const { config } = useContext(getModuleContext());

    const displayComments = !!config?.specific?.orderDetails?.tabs?.reception?.displayComments ?? true;

    useEffect(() => {
        id && !isReceptionsLoading && id !== orderId && getOrderReceptionsRequest(id);
        // eslint-disable-next-line
    }, [id, orderId, getOrderReceptionsRequest]);

    if (isReceptionsLoading || isOrderDetailsLoading) {
        return <SpinStyled />;
    }

    const comments = displayComments && <CommentPanel commentsCount={orderDetails?.comments.length} />;

    if (!receptions?.length)
        return (
            <>
                <EmptyState
                    title={t('order_reception_detailed.empty.title')}
                    subtitle={t('order_reception_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {receptions?.map((reception, index) => (
                <ReceptionTable
                    reception={reception}
                    key={reception.id}
                    index={index}
                    currency={orderDetails?.currency || DEFAULT_CURRENCY}
                />
            ))}
            {comments}
        </>
    );
};
