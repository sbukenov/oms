import React, { FC, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from 'antd/lib/divider';
import Space from 'antd/lib/space';
import Tooltip from 'antd/lib/tooltip';
import Text from 'antd/lib/typography/Text';
import { useSelector } from 'react-redux';
import { Icon, Alert } from '@bo/component-library';
import { CustomActionConfigurationShort, useLineConfiguration, usePrivileges } from '@-bo/utils';
import { Attachments, CustomActions } from '@-bo/keystone-components';

import { getModuleContext, showReference, showSuccessNotification } from '~/utils';
import type { OrderShipment } from '~/models';
import { ShipmentStatusCodes } from '~/models';
import { useActions } from '~/hooks';
import { refreshActionsMap, shipmentsActions } from '~/redux/slices';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import { Status, AdditionalInfoTooltip, ShipmentHandOverModal } from '~/components';
import {
    DEFAULT_SLASH,
    CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO,
    SHIPMENT_ACTIONS,
    QA_DELIVERY_HEADER_ACTION,
    QA_DELIVERY_HEADER_ATTACHMENTS,
    QA_DELIVERY_HEADER_DELIVERED_BY,
    QA_DELIVERY_HEADER_INFO,
    QA_DELIVERY_HEADER_REFERENCE,
    QA_DELIVERY_HEADER_SHIPPED_FROM,
    QA_DELIVERY_HEADER_STATUS,
    QA_DELIVERY_HEADER_TRACKING_LINK,
    MAX_SIZE,
    FORMATS,
    HAND_OVER_SHIPMENT,
} from '~/const';
import { selectOrderDetailsData } from '~/redux/selectors';

import { ButtonStyled, PanelStyled, TextStyled } from './DeliveryHeader.styled';

interface DeliveryHeaderProps {
    shipment: OrderShipment;
    index: number;
}

export const DeliveryHeader: FC<DeliveryHeaderProps> = ({ shipment, index }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);

    const actionsData = useMemo(
        () => ({ shipment, order, url, baseRoute, privileges }),
        [shipment, order, url, baseRoute, privileges],
    );

    const { deleteShipmentAttachment } = useActions(shipmentsActions);

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.delivery?.additionalInfo || SHORT_CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO;

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO,
    );

    const handleTrackingLink = useCallback(() => {
        shipment.tracking_link && window.open(shipment.tracking_link);
    }, [shipment.tracking_link]);

    const onDelete = useCallback(
        (attachment) => {
            Alert.confirm({
                title: t('modals.confirm_delete_attachment.title'),
                content: t('modals.confirm_delete_attachment.content'),
                okText: t('common.confirm'),
                cancelText: t('common.cancel'),
                onOk: () => {
                    deleteShipmentAttachment({
                        id: shipment.id,
                        attachmentId: attachment.uuid,
                        onSuccess: () =>
                            showSuccessNotification({
                                message: t('notifications.attachment_deleted_successfully.message'),
                                description: t('notifications.attachment_deleted_successfully.description'),
                            }),
                    });
                    return false;
                },
            });
        },
        [deleteShipmentAttachment, shipment.id, t],
    );

    const modalSwitch = useCallback(
        (action: CustomActionConfigurationShort | undefined, close: () => void) => {
            if (!order || !action) return;

            switch (action.name) {
                case HAND_OVER_SHIPMENT:
                    return <ShipmentHandOverModal shipment={shipment} selectedAction={action} close={close} />;
                default:
                    return;
            }
        },
        [order, shipment],
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.delivery?.actions || SHIPMENT_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PanelStyled>
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_DELIVERY_HEADER_REFERENCE}${index}`} strong>
                    {showReference(shipment.reference)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_DELIVERY_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ shipment }}
                />
                <Divider type="vertical" />
                {shipment.cancelled_at ? (
                    <Status
                        className={`${QA_DELIVERY_HEADER_STATUS}${index}`}
                        group="shipment"
                        code={ShipmentStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status
                        className={`${QA_DELIVERY_HEADER_STATUS}${index}`}
                        group="shipment"
                        code={shipment.status}
                    />
                )}
                <Divider type="vertical" />
                <TextStyled>
                    <Space>
                        <Icon name="shop" size="sm" />
                        {t('order_shipment_detailed.shipped_from')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_DELIVERY_HEADER_SHIPPED_FROM}${index}`}>{shipment.issuer.label}</Text>
                <TextStyled>
                    <Space>
                        <Icon name="shop" size="sm" />
                        {t('order_shipment_detailed.delivered_by')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_DELIVERY_HEADER_DELIVERED_BY}${index}`}>{DEFAULT_SLASH}</Text>
                <ButtonStyled
                    className={`${QA_DELIVERY_HEADER_TRACKING_LINK}${index}`}
                    type="link"
                    disabled={!shipment.tracking_link}
                    onClick={handleTrackingLink}
                >
                    <Tooltip placement="top" title={shipment.tracking_link}>
                        {t('common.tracking_ID')}
                    </Tooltip>
                </ButtonStyled>
            </SpaceStyled>
            <div>
                <Attachments
                    t={t}
                    className={`${QA_DELIVERY_HEADER_ATTACHMENTS}${index}`}
                    attachments={shipment.attachments}
                    api={url}
                    onDelete={onDelete}
                />
                <CustomActions
                    className={`${QA_DELIVERY_HEADER_ACTION}${index}`}
                    data={actionsData}
                    actionsConfig={actionsConfig}
                    refreshActionsMap={refreshActionsMap}
                    modalSwitch={modalSwitch}
                    maxSize={maxSize}
                    formats={formats}
                    shape="circle"
                    t={t}
                />
            </div>
        </PanelStyled>
    );
};
