import React, { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { DEFAULT_CURRENCY, usePrivileges, IdParam } from '@bo/utils';

import { useActions } from '~/hooks';
import { SpinStyled } from '~/style/commonStyle';
import { getModuleContext, redirectToFirstAvailableTab } from '~/utils';
import { fulfillmentsActions } from '~/redux/slices';
import { selectOrderFulfillmentDetailed, selectOrderDetails } from '~/redux/selectors';
import { EmptyState } from '~/components';
import { PRIVILEGE_PREPARATION_TAB } from '~/const';

import { CommentPanel } from '../../comments';
import { PreparationTable } from '../../tables';

export const PreparationTab: FC = () => {
    const { id } = useParams<IdParam>();
    const { data: fulfillmentDetailed, loading: isFulfilmentLoading } = useSelector(selectOrderFulfillmentDetailed);
    const { loading: isOrderDetailsLoading, data: orderDetails } = useSelector(selectOrderDetails);
    const { getOrderFulfillmentDetailedRequest } = useActions(fulfillmentsActions);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());

    const displayComments = !!config?.specific?.orderDetails?.tabs?.preparation?.displayComments ?? true;

    useEffect(() => {
        if (!privileges?.size || !id || privileges.has(PRIVILEGE_PREPARATION_TAB)) return;

        redirectToFirstAvailableTab({ baseRoute, id, privileges, navigate, t });

        // to exclude "navigate"
        // eslint-disable-next-line
    }, [baseRoute, id, privileges, t]);

    useEffect(() => {
        id &&
            privileges?.has(PRIVILEGE_PREPARATION_TAB) &&
            !isFulfilmentLoading &&
            id !== fulfillmentDetailed?.id &&
            getOrderFulfillmentDetailedRequest(id);
        // eslint-disable-next-line
    }, [id, fulfillmentDetailed?.id, getOrderFulfillmentDetailedRequest]);

    if (isFulfilmentLoading || isOrderDetailsLoading) {
        return <SpinStyled />;
    }

    const comments = displayComments && <CommentPanel commentsCount={orderDetails?.comments.length} />;

    if (!fulfillmentDetailed?.fulfillments?.length)
        return (
            <>
                <EmptyState
                    title={t('order_fulfillment_detailed.empty.title')}
                    subtitle={t('order_fulfillment_detailed.empty.subtitle')}
                />
                {comments}
            </>
        );

    return (
        <>
            {fulfillmentDetailed?.fulfillments.map((fulfillment, index) => (
                // TODO Currency hardcoded for now, remove it later if fulfillment object will not have currency
                <PreparationTable
                    fulfillment={fulfillment}
                    key={fulfillment.id}
                    index={index}
                    currency={orderDetails?.currency || DEFAULT_CURRENCY}
                    order={orderDetails}
                />
            ))}
            {comments}
        </>
    );
};
