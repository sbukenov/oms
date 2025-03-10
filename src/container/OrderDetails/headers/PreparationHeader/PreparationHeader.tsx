import { Icon } from '@-bo/component-library';
import { Divider, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CustomActions } from '@-bo/keystone-components';
import { CustomActionConfigurationShort, useLineConfiguration, usePrivileges } from '@-bo/utils';

import { showReference, isFulfillmentReadyForPreparation, getModuleContext } from '~/utils';
import { Fulfillment, FulfillmentStatusCodes } from '~/models';
import { ShipmentCreationModal, Status } from '~/components';
import { AdditionalInfoTooltip } from '~/components/AdditionalInfoTooltip';
import { selectOrderDetailsData } from '~/redux/selectors';
import { useActions } from '~/hooks';
import { fulfillmentsActions, refreshActionsMap } from '~/redux/slices';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import {
    CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO,
    FULFILLMENT_ACTIONS,
    QA_PREPARATION_HEADER_REFERENCE,
    QA_PREPARATION_HEADER_INFO,
    QA_PREPARATION_HEADER_ENTITY,
    QA_PREPARATION_HEADER_PREPARE,
    QA_PREPARATION_HEADER_RESUME,
    QA_PREPARATION_HEADER_STATUS,
    QA_PREPARATION_HEADER_ACTION,
    PRIVILEGE_FULFILLMENT_PREPARE,
    MAX_SIZE,
    FORMATS,
    CREATE_SHIPMENT,
} from '~/const';

import { ActionsGroup, ButtonStyled, PanelStyled, TextStyled } from './PreparationHeader.styled';

interface PreparationHeaderProps {
    fulfillment: Fulfillment;
    index: number;
}

export const PreparationHeader: FC<PreparationHeaderProps> = ({ fulfillment, index }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);

    const actionsData = useMemo(
        () => ({ order, url, baseRoute, privileges, fulfillment }),
        [order, url, baseRoute, privileges, fulfillment],
    );

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.preparation?.additionalInfo ||
        SHORT_CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO;

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__FULFILLMENT_ADDITIONAL_INFO,
    );

    const { prepareFulfillment } = useActions(fulfillmentsActions);

    const handlePreparation = useCallback(() => {
        prepareFulfillment({ fulfillmentId: fulfillment.id, navigate, state });
    }, [fulfillment.id, navigate, prepareFulfillment, state]);

    const actionsModalSwitch = useCallback(
        (action: CustomActionConfigurationShort | undefined, close: () => void) => {
            if (!order || !action) return;

            switch (action.name) {
                case CREATE_SHIPMENT:
                    return (
                        <ShipmentCreationModal
                            close={close}
                            selectedAction={action}
                            fulfillmentId={fulfillment.id}
                            ownerId={fulfillment.owner.id}
                        />
                    );
                default:
                    return;
            }
        },
        [fulfillment.id, fulfillment.owner.id, order],
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.preparation?.actions || FULFILLMENT_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;
    const canPrepare = fulfillment.status === FulfillmentStatusCodes.TO_PREPARE;
    const isCancelled = fulfillment.cancelled_at || order?.cancelled_at;

    const isPreparationDisplayed =
        privileges?.has(PRIVILEGE_FULFILLMENT_PREPARE) &&
        !isCancelled &&
        !!fulfillment.fulfillment_items?.length &&
        isFulfillmentReadyForPreparation(fulfillment);

    return (
        <PanelStyled>
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_PREPARATION_HEADER_REFERENCE}${index}`} strong>
                    {showReference(fulfillment.reference)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_PREPARATION_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ fulfillment }}
                />
                <Divider type="vertical" />
                {fulfillment.cancelled_at ? (
                    <Status
                        className={`${QA_PREPARATION_HEADER_STATUS}${index}`}
                        group="fulfillment"
                        code={FulfillmentStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status
                        className={`${QA_PREPARATION_HEADER_STATUS}${index}`}
                        group="fulfillment"
                        code={fulfillment.status}
                    />
                )}
                <Divider type="vertical" />
                <TextStyled>
                    <Space>
                        <Icon name="shop" size="sm" />
                        {t('order_fulfillment_detailed.preparation_entity')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_PREPARATION_HEADER_ENTITY}${index}`}>{fulfillment.owner.label}</Text>
            </SpaceStyled>
            <ActionsGroup>
                {isPreparationDisplayed &&
                    (canPrepare ? (
                        <ButtonStyled
                            className={`${QA_PREPARATION_HEADER_PREPARE}${index}`}
                            onClick={handlePreparation}
                        >
                            {t('order_fulfillment_detailed.prepare')}
                        </ButtonStyled>
                    ) : (
                        <ButtonStyled className={`${QA_PREPARATION_HEADER_RESUME}${index}`} onClick={handlePreparation}>
                            {t('order_fulfillment_detailed.resume')}
                        </ButtonStyled>
                    ))}
                <CustomActions
                    className={`${QA_PREPARATION_HEADER_ACTION}${index}`}
                    actionsConfig={actionsConfig}
                    data={actionsData}
                    refreshActionsMap={refreshActionsMap}
                    modalSwitch={actionsModalSwitch}
                    maxSize={maxSize}
                    formats={formats}
                    shape="circle"
                    t={t}
                />
            </ActionsGroup>
        </PanelStyled>
    );
};
