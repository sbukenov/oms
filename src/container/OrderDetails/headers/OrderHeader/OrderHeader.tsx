import React, { Fragment, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { Icon } from '@-bo/component-library';
import { CustomActions } from '@-bo/keystone-components';
import { CustomActionConfigurationShort, LONG_DATE_FORMAT, usePrivileges } from '@-bo/utils';

import { selectOrderDetailsData } from '~/redux/selectors';
import {
    ORDER_ACTIONS,
    QA_ORDER_DETAILS_GO_BACK,
    QA_ORDER_DETAILS_ACTIONS,
    QA_ORDER_DETAILS_CREATED_AT,
    QA_ORDER_DETAILS_REFERENCE,
    QA_ORDER_DETAILS_STATUS,
    CREATE_RETURN,
    EDIT_DELIVERY_ADDRESS,
    RECEIVE_ORDER,
    MAX_SIZE,
    FORMATS,
} from '~/const';
import { getModuleContext } from '~/utils/context';
import { OverflowHiddenText } from '~/style/commonStyle';
import { EditDeliveryAddressModal, OrderReceptionModal, ReturnCreationModal, Status } from '~/components';
import { OrderStatusCodes } from '~/models';
import { refreshActionsMap } from '~/redux/slices';

import { PageHeaderStyled, DateWrapper, ReferenceWrapper, IconStyled } from './OrderHeader.styled';

export const OrderHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);
    const actionsData = useMemo(() => ({ order, url, baseRoute, privileges }), [order, url, baseRoute, privileges]);

    const modalSwitch = useCallback(
        (action: CustomActionConfigurationShort | undefined, close: () => void) => {
            if (!order || !action) return;

            switch (action.name) {
                case CREATE_RETURN:
                    return <ReturnCreationModal close={close} order={order} />;
                case EDIT_DELIVERY_ADDRESS:
                    return <EditDeliveryAddressModal close={close} order={order} />;
                case RECEIVE_ORDER:
                    return <OrderReceptionModal close={close} config={action} />;
                default:
                    return;
            }
        },
        [order],
    );

    const onBack = useCallback(() => {
        // @ts-ignore
        const paths = state?.pathname?.split('/');
        paths?.length > 2 ? navigate(`/${paths[1]}/${paths[2]}`, { state: { noRefresh: true } }) : navigate(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    if (!order) {
        return (
            <PageHeaderStyled
                title={<span className={QA_ORDER_DETAILS_REFERENCE}>-</span>}
                backIcon={<Icon name="arrow-left" className={QA_ORDER_DETAILS_GO_BACK} />}
                onBack={onBack}
            />
        );
    }

    const actionsConfig = config?.specific?.orderDetails?.actions || ORDER_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PageHeaderStyled
            title={<ReferenceWrapper className={QA_ORDER_DETAILS_REFERENCE}>{order.reference}</ReferenceWrapper>}
            subTitle={
                <DateWrapper>
                    <IconStyled name="calendar" size="md" verticalAlign="sub" />
                    <OverflowHiddenText className={QA_ORDER_DETAILS_CREATED_AT}>{`${t('order.created_at')} ${dayjs(
                        order.created_at,
                    ).format(LONG_DATE_FORMAT)}`}</OverflowHiddenText>
                </DateWrapper>
            }
            backIcon={<Icon name="arrow-left" className={QA_ORDER_DETAILS_GO_BACK} />}
            onBack={onBack}
            extra={[
                <Fragment key="extra-1">
                    {order.cancelled_at ? (
                        <Status className={QA_ORDER_DETAILS_STATUS} group="order" code={OrderStatusCodes.CANCELLED} />
                    ) : (
                        <Status className={QA_ORDER_DETAILS_STATUS} group="order" code={order.status} />
                    )}
                    {!!actionsConfig?.length && (
                        <CustomActions
                            className={QA_ORDER_DETAILS_ACTIONS}
                            actionsConfig={actionsConfig}
                            data={actionsData}
                            modalSwitch={modalSwitch}
                            maxSize={maxSize}
                            formats={formats}
                            refreshActionsMap={refreshActionsMap}
                            t={t}
                        />
                    )}
                </Fragment>,
            ]}
        />
    );
};
