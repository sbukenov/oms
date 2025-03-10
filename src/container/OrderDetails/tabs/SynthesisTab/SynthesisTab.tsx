import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePrivileges, validateRules, IdParam } from '@bo/utils';
import React, { FC, useContext, useEffect } from 'react';

import {
    PRIVILEGE_SYNTHESIS_TAB,
    SHORT_CONFIG_LINES__ORDER_DETAILS_PANEL,
    SHORT_CONFIG_LINES__SYNTHESIS_DETAILS_PANEL,
} from '~/const';
import { selectOrderDetails } from '~/redux/selectors';
import { getModuleContext } from '~/utils/context';
import { redirectToFirstAvailableTab } from '~/utils';
import { OrderPanelsRow, SpinStyled } from '~/style/commonStyle';

import { OrderCustomerPanel, OrderDetailsPanel, OrderHistoryPanel, SupplierPanel } from '../../Panels';
import { OrderContentTable, OrderReplenishmentTable } from '../../tables';
import { CommentPanel } from '../../comments';

export const SynthesisTab: FC = () => {
    const { id } = useParams<IdParam>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { loading, data: order } = useSelector(selectOrderDetails);
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const tabConfigs = config?.specific?.orderDetails?.tabs;
    const displaySynthesisComments = !!tabConfigs?.synthesis?.displayComments ?? true;
    const synthesisRules = tabConfigs?.synthesis?.rules;
    const displayOrderComments = !!tabConfigs?.order?.displayComments ?? true;
    const orderRules = tabConfigs?.order?.rules;
    const linesConfigSynthesis =
        tabConfigs?.synthesis?.panels?.orderDetails || SHORT_CONFIG_LINES__SYNTHESIS_DETAILS_PANEL;
    const linesConfigOrder = tabConfigs?.order?.panels?.orderDetails || SHORT_CONFIG_LINES__ORDER_DETAILS_PANEL;

    useEffect(() => {
        if (!privileges?.size || !id || privileges.has(PRIVILEGE_SYNTHESIS_TAB)) return;

        redirectToFirstAvailableTab({ baseRoute, id, privileges, navigate, t });

        // to exclude "navigate"
        // eslint-disable-next-line
    }, [baseRoute, id, privileges, t]);

    if (loading) {
        return <SpinStyled />;
    }

    if (validateRules(synthesisRules, { order })) {
        return (
            <>
                <OrderPanelsRow size={16}>
                    <OrderCustomerPanel />
                    <OrderDetailsPanel linesConfiguration={linesConfigSynthesis} />
                    <OrderHistoryPanel />
                </OrderPanelsRow>
                {!!order && <OrderContentTable order={order} loading={loading} />}
                {displaySynthesisComments && <CommentPanel commentsCount={order?.comments.length} />}
            </>
        );
    }
    if (validateRules(orderRules, { order })) {
        return (
            <>
                <OrderPanelsRow size={16}>
                    <SupplierPanel />
                    <OrderDetailsPanel linesConfiguration={linesConfigOrder} />
                    <OrderHistoryPanel />
                </OrderPanelsRow>
                {!!order && <OrderReplenishmentTable order={order} loading={loading} />}
                {displayOrderComments && <CommentPanel commentsCount={order?.comments.length} />}
            </>
        );
    }
    return null;
};
