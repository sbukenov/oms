import { Icon } from '@-bo/component-library';
import { Divider, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import React, { useContext, useMemo, FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomActions } from '@-bo/keystone-components';
import { CustomActionConfigurationShort, useLineConfiguration, usePrivileges } from '@-bo/utils';

import { getModuleContext, isFee, showReference } from '~/utils';
import { Transaction, FulfillmentStatusCodes } from '~/models';
import { AddTransactionFeeModal, EditTransactionFeeModal, Status } from '~/components';
import { AdditionalInfoTooltip } from '~/components/AdditionalInfoTooltip';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import {
    CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO,
    TRANSACTION_ACTIONS,
    QA_TRANSACTION_HEADER_ACTION,
    QA_TRANSACTION_HEADER_ENTITY,
    QA_TRANSACTION_HEADER_INFO,
    QA_TRANSACTION_HEADER_REFERENCE,
    QA_TRANSACTION_HEADER_STATUS,
    QA_TRANSACTION_HEADER_TYPE,
    MAX_SIZE,
    FORMATS,
    ADD_FEE,
    EDIT_FEE,
} from '~/const';
import { selectOrderDetailsData } from '~/redux/selectors';
import { refreshActionsMap } from '~/redux/slices';

import { PanelStyled, TextStyled } from './TransactionHeader.styled';

interface TransactionHeaderProps {
    transaction: Transaction;
    index: number;
}

export const TransactionHeader: FC<TransactionHeaderProps> = ({ index, transaction }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);

    const actionsData = useMemo(
        () => ({ transaction, url, order, baseRoute, privileges }),
        [transaction, url, order, baseRoute, privileges],
    );

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.transaction?.additionalInfo ||
        SHORT_CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO;

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO,
    );

    const modalSwitch = useCallback(
        (action: CustomActionConfigurationShort | undefined, close: () => void) => {
            if (!order || !action) return;

            switch (action.name) {
                case ADD_FEE:
                    return <AddTransactionFeeModal close={close} selectedAction={action} data={actionsData} />;
                case EDIT_FEE: {
                    if (isFee(actionsData)) {
                        return <EditTransactionFeeModal close={close} selectedAction={action} data={actionsData} />;
                    }
                    return;
                }
                default:
                    return;
            }
        },
        [actionsData, order],
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.transaction?.actions || TRANSACTION_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PanelStyled>
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_TRANSACTION_HEADER_REFERENCE}${index}`} strong>
                    {showReference(transaction.reference)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_TRANSACTION_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ transaction }}
                />
                <Divider type="vertical" />
                {transaction.cancelled_at ? (
                    <Status
                        className={`${QA_TRANSACTION_HEADER_STATUS}${index}`}
                        group="transaction"
                        code={FulfillmentStatusCodes.CANCELLED}
                    />
                ) : (
                    <Status
                        className={`${QA_TRANSACTION_HEADER_STATUS}${index}`}
                        group="transaction"
                        code={transaction.status}
                    />
                )}
                <Divider type="vertical" />
                <TextStyled>
                    <Space>
                        <Icon name="shop" size="sm" />
                        {t('common.entity')}
                    </Space>
                </TextStyled>
                <Text className={`${QA_TRANSACTION_HEADER_ENTITY}${index}`}>{transaction.owner.label}</Text>
                <Divider type="vertical" />
                <TextStyled>{t('common.type')}</TextStyled>
                <Text className={`${QA_TRANSACTION_HEADER_TYPE}${index}`}>
                    {t(`type.Transaction.${transaction.type}`)}
                </Text>
            </SpaceStyled>
            <CustomActions
                className={`${QA_TRANSACTION_HEADER_ACTION}${index}`}
                actionsConfig={actionsConfig}
                data={actionsData}
                refreshActionsMap={refreshActionsMap}
                modalSwitch={modalSwitch}
                maxSize={maxSize}
                formats={formats}
                shape="circle"
                t={t}
            />
        </PanelStyled>
    );
};
