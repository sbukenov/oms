import { Color, Icon } from '@bo/component-library';
import { Divider, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomActions } from '@-bo/keystone-components';
import { useLineConfiguration, usePrivileges } from '@-bo/utils';

import type { OrderReturn } from '~/models';
import { ReturnStatusCodes } from '~/models';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import { Status } from '~/components';
import { AdditionalInfoTooltip } from '~/components/AdditionalInfoTooltip';
import { getModuleContext, showReference } from '~/utils';
import {
    CONFIG_LINES__RETURN_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__RETURN_ADDITIONAL_INFO,
    RETURN_ACTIONS,
    QA_RETURN_HEADER_ACTION,
    QA_RETURN_HEADER_ENTITY,
    QA_RETURN_HEADER_INFO,
    QA_RETURN_HEADER_REFERENCE,
    QA_RETURN_HEADER_RETURN_TYPE,
    QA_RETURN_HEADER_STATUS,
    MAX_SIZE,
    FORMATS,
} from '~/const';
import { selectOrderDetailsData } from '~/redux/selectors';
import { refreshActionsMap } from '~/redux/slices';

import { PanelStyled, TextStyled } from './ReturnHeader.styled';

interface ReturnHeaderProps {
    orderReturn: OrderReturn;
    index: number;
}

export const ReturnHeader: FC<ReturnHeaderProps> = ({ index, orderReturn }) => {
    const { t } = useTranslation();
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);
    const { baseRoute, config, url } = useContext(getModuleContext());

    const actionsData = useMemo(
        () => ({ orderReturn, url, order, baseRoute, privileges }),
        [orderReturn, url, order, baseRoute, privileges],
    );

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.return?.additionalInfo || SHORT_CONFIG_LINES__RETURN_ADDITIONAL_INFO;

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__RETURN_ADDITIONAL_INFO,
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.return?.actions || RETURN_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PanelStyled>
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_RETURN_HEADER_REFERENCE}${index}`} strong>
                    {showReference(orderReturn?.merchant_ref)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_RETURN_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ orderReturn }}
                />
                <Divider type="vertical" />
                {orderReturn.cancelled_at ? (
                    <Status
                        className={`${QA_RETURN_HEADER_STATUS}${index}`}
                        group="return"
                        code={ReturnStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status className={`${QA_RETURN_HEADER_STATUS}${index}`} group="return" code={orderReturn.status} />
                )}
                <Divider type="vertical" />
                <TextStyled>
                    <Space>
                        <Icon name="clipboard-list" size="sm" color={Color.neutral(5)} />
                        {t('order_return_detailed.return_type')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_RETURN_HEADER_RETURN_TYPE}${index}`}>
                    {t(`type.OrderReturn.${orderReturn.type}`)}
                </Text>
                <TextStyled>
                    <Space>
                        <Icon name="shop" size="sm" color={Color.neutral(5)} />
                        {t('order_return_detailed.return_entity')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_RETURN_HEADER_ENTITY}${index}`}>{orderReturn.owner.label}</Text>
            </SpaceStyled>
            <CustomActions
                className={`${QA_RETURN_HEADER_ACTION}${index}`}
                data={actionsData}
                actionsConfig={actionsConfig}
                refreshActionsMap={refreshActionsMap}
                maxSize={maxSize}
                formats={formats}
                shape="circle"
                t={t}
            />
        </PanelStyled>
    );
};
