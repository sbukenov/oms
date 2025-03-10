import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Space from 'antd/lib/space';
import { useLocation } from 'react-router-dom';
import { usePrivileges, validateRules } from '@bo/utils';

import { Spacer } from '~/style/commonStyle';
import { selectOrderDetails } from '~/redux/selectors';
import { ExtraNavContent } from '~/container';
import { getModuleContext } from '~/utils';
import {
    QA_ORDER_DELIVERY_TAB,
    QA_ORDER_EXPEDITION_TAB,
    QA_ORDER_RECEPTION_TAB,
    QA_ORDER_PREPARATION_TAB,
    QA_ORDER_RETURN_TAB,
    QA_ORDER_SYNTHESIS_TAB,
    QA_ORDER_TRANSACTION_TAB,
    ROUTE_DELIVERY,
    ROUTE_PREPARATION,
    ROUTE_RETURN,
    ROUTE_TRANSACTION,
    ROUTE_EXPEDITION,
    ROUTE_RECEPTION,
} from '~/const';

import { CommonLayout, NavLinkStyled, NavigationStyled, NavLinkWrapper } from '~/style/commonStyle';
import {
    PRIVILEGE_DELIVERY_TAB,
    PRIVILEGE_PREPARATION_TAB,
    PRIVILEGE_RETURN_TAB,
    PRIVILEGE_SYNTHESIS_TAB,
    PRIVILEGE_TRANSACTION_TAB,
} from '../../const';

export const OrderDetailsNavLayout: React.FC = () => {
    const { t } = useTranslation();
    const { config } = useContext(getModuleContext());
    const { state } = useLocation();
    const { loading, data: order } = useSelector(selectOrderDetails);
    const privileges = usePrivileges(getModuleContext());
    const synthesisRules = config?.specific?.orderDetails?.tabs?.synthesis?.rules;
    const orderRules = config?.specific?.orderDetails?.tabs?.order?.rules;
    const expeditionRules = config?.specific?.orderDetails?.tabs?.expedition?.rules;
    const receptionRules = config?.specific?.orderDetails?.tabs?.reception?.rules;
    const preparationRules = config?.specific?.orderDetails?.tabs?.preparation?.rules;
    const deliveryRules = config?.specific?.orderDetails?.tabs?.delivery?.rules;
    const returnRules = config?.specific?.orderDetails?.tabs?.return?.rules;
    const transactionRules = config?.specific?.orderDetails?.tabs?.transaction?.rules;

    if (!privileges || loading) return null;
    const orderData = { order };
    return (
        <CommonLayout>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <NavigationStyled>
                    <NavLinkWrapper>
                        {privileges.has(PRIVILEGE_SYNTHESIS_TAB) &&
                            (validateRules(synthesisRules, orderData) || validateRules(orderRules, orderData)) && (
                                <NavLinkStyled className={QA_ORDER_SYNTHESIS_TAB} state={state} to="" replace end>
                                    {t('order.order_synthesis')}
                                </NavLinkStyled>
                            )}
                        {validateRules(expeditionRules, orderData) && (
                            <NavLinkStyled
                                className={QA_ORDER_EXPEDITION_TAB}
                                state={state}
                                to={ROUTE_EXPEDITION}
                                replace
                            >
                                {t('common.expedition')}
                            </NavLinkStyled>
                        )}
                        {validateRules(receptionRules, orderData) && (
                            <NavLinkStyled
                                className={QA_ORDER_RECEPTION_TAB}
                                state={state}
                                to={ROUTE_RECEPTION}
                                replace
                            >
                                {t('common.receptions')}
                            </NavLinkStyled>
                        )}
                        {privileges.has(PRIVILEGE_PREPARATION_TAB) && validateRules(preparationRules, orderData) && (
                            <NavLinkStyled
                                className={QA_ORDER_PREPARATION_TAB}
                                state={state}
                                to={ROUTE_PREPARATION}
                                replace
                            >
                                {t('common.preparation')}
                            </NavLinkStyled>
                        )}
                        {privileges.has(PRIVILEGE_DELIVERY_TAB) && validateRules(deliveryRules, orderData) && (
                            <NavLinkStyled className={QA_ORDER_DELIVERY_TAB} state={state} to={ROUTE_DELIVERY} replace>
                                {t('common.delivery')}
                            </NavLinkStyled>
                        )}
                        {privileges.has(PRIVILEGE_RETURN_TAB) && validateRules(returnRules, orderData) && (
                            <NavLinkStyled className={QA_ORDER_RETURN_TAB} state={state} to={ROUTE_RETURN} replace>
                                {t('common.returns')}
                            </NavLinkStyled>
                        )}
                        {privileges.has(PRIVILEGE_TRANSACTION_TAB) && validateRules(transactionRules, orderData) && (
                            <NavLinkStyled
                                className={QA_ORDER_TRANSACTION_TAB}
                                state={state}
                                to={ROUTE_TRANSACTION}
                                replace
                            >
                                {t('common.transactions')}
                            </NavLinkStyled>
                        )}
                    </NavLinkWrapper>
                    <Spacer />
                    <ExtraNavContent />
                </NavigationStyled>
                <Outlet />
            </Space>
        </CommonLayout>
    );
};
