import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { usePrivileges, IdParam } from '@bo/utils';

import { useActions } from '~/hooks';
import { getModuleContext, redirectToFirstAvailableTab } from '~/utils';
import { SpinStyled } from '~/style/commonStyle';
import { returnsActions } from '~/redux/slices';
import { selectOrderReturns, selectOrderDetails } from '~/redux/selectors';
import { EmptyState } from '~/components';
import { PRIVILEGE_RETURN_TAB } from '~/const';

import { CommentPanel } from '../../comments';
import { ReturnTable } from '../../tables';

export const ReturnTab: FC = () => {
    const { id } = useParams<IdParam>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const { returns, orderId, loading: isReturnLoading } = useSelector(selectOrderReturns);
    const { loading: isOrderDetailsLoading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderReturnsRequest } = useActions(returnsActions);

    const displayComments = !!config?.specific?.orderDetails?.tabs?.return?.displayComments ?? true;

    useEffect(() => {
        if (!privileges?.size || !id || privileges.has(PRIVILEGE_RETURN_TAB)) return;

        redirectToFirstAvailableTab({ baseRoute, id, privileges, navigate, t });

        // to exclude "navigate"
        // eslint-disable-next-line
    }, [baseRoute, id, privileges, t]);

    useEffect(() => {
        id && privileges?.has(PRIVILEGE_RETURN_TAB) && !isReturnLoading && id !== orderId && getOrderReturnsRequest(id);
        // eslint-disable-next-line
    }, [id, getOrderReturnsRequest, orderId]);

    if (isReturnLoading || isOrderDetailsLoading) {
        return <SpinStyled />;
    }

    const comments = displayComments && <CommentPanel commentsCount={orderDetails?.comments.length} />;

    if (!returns?.length || !orderDetails)
        return (
            <>
                <EmptyState
                    title={t('order_return_detailed.empty.title')}
                    subtitle={t('order_return_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {returns?.map((orderReturn, index) => (
                <ReturnTable
                    index={index}
                    orderReturn={orderReturn}
                    key={orderReturn.id}
                    currency={orderDetails.currency}
                />
            ))}
            {comments}
        </>
    );
};
