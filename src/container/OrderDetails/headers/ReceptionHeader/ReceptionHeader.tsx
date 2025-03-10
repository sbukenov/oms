import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from 'antd/lib/divider';
import { CustomActions } from '@-bo/keystone-components';
import { ShortUser, useLineConfiguration, usePrivileges } from '@-bo/utils';
import { useSelector } from 'react-redux';

import { showReference, getModuleContext } from '~/utils';
import { ReplenishmentOperation, ReceptionAdditionalInfoDefaultLines } from '~/models';
import { Status, AdditionalInfoTooltip } from '~/components';
import { refreshActionsMap } from '~/redux/slices';
import { selectOrderDetailsData } from '~/redux/selectors';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import {
    CONFIG_LINES__RECEPTION_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__RECEPTION_ADDITIONAL_INFO,
    QA_RECEPTION_REFERENCE,
    QA_RECEPTION_HEADER_INFO,
    QA_RECEPTION_STATUS,
    QA_RECEPTION_ACTIONS,
    DEFAULT_DASH,
    MAX_SIZE,
    FORMATS,
    RECEPTION_ACTIONS,
} from '~/const';

import { ActionsGroup, PanelStyled } from './ReceptionHeader.styled';

interface ReceptionHeaderProps {
    reception: ReplenishmentOperation;
    index: number;
}

export const ReceptionHeader: FC<ReceptionHeaderProps> = ({ reception, index }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const order = useSelector(selectOrderDetailsData);

    const actionsData = useMemo(
        () => ({ reception, order, url, baseRoute, privileges }),
        [reception, order, url, baseRoute, privileges],
    );

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.reception?.additionalInfo || SHORT_CONFIG_LINES__RECEPTION_ADDITIONAL_INFO;

    const defaultLines: { [key in ReceptionAdditionalInfoDefaultLines]?: any } = {
        CREATED_BY: {
            path: ['reception', 'created_by'],
            title: t('common.created_by'),
            render: ({ last_name, first_name }: ShortUser) =>
                last_name || first_name ? `${first_name} ${last_name}` : DEFAULT_DASH,
        },
    };

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__RECEPTION_ADDITIONAL_INFO,
        defaultLines,
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.reception?.actions || RECEPTION_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PanelStyled>
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_RECEPTION_REFERENCE}${index}`} strong>
                    {showReference(reception.reference)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_RECEPTION_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ reception }}
                />
                <Divider type="vertical" />
                <Status className={`${QA_RECEPTION_STATUS}${index}`} group="orderReception" code={reception.status} />
            </SpaceStyled>
            <ActionsGroup>
                <CustomActions
                    className={`${QA_RECEPTION_ACTIONS}${index}`}
                    actionsConfig={actionsConfig}
                    data={actionsData}
                    refreshActionsMap={refreshActionsMap}
                    maxSize={maxSize}
                    formats={formats}
                    shape="circle"
                    t={t}
                />
            </ActionsGroup>
        </PanelStyled>
    );
};
