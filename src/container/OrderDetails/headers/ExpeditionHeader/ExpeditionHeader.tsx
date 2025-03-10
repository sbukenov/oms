import useModal from 'antd/lib/modal/useModal';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Divider from 'antd/lib/divider';
import { ShortUser, showSuccessNotification, useLineConfiguration, usePrivileges } from '@-bo/utils';
import { Attachments, CustomActions } from '@-bo/keystone-components';

import { showReference, getModuleContext } from '~/utils';
import { ReplenishmentOperation, ExpeditionAdditionalInfoDefaultLines } from '~/models';
import { Status } from '~/components';
import { AdditionalInfoTooltip } from '~/components/AdditionalInfoTooltip';
import { expeditionsActions, refreshActionsMap } from '~/redux/slices';
import { selectAttachmentDeleting, selectOrderDetailsData } from '~/redux/selectors';
import { LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import {
    CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO,
    SHORT_CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO,
    QA_EXPEDITION_HEADER_REFERENCE,
    QA_EXPEDITION_HEADER_STATUS,
    QA_EXPEDITION_HEADER_ACTIONS,
    QA_EXPEDITION_HEADER_INFO,
    DEFAULT_DASH,
    MAX_SIZE,
    FORMATS,
    EXPEDITION_ACTIONS,
    QA_EXPEDITION_HEADER_ATTACHMENTS,
} from '~/const';
import { useActions } from '~/hooks';

import { ActionsGroup, PanelStyled } from './ExpeditionHeader.styled';

interface ExpeditionHeaderProps {
    expedition: ReplenishmentOperation;
    index: number;
}

export const ExpeditionHeader: FC<ExpeditionHeaderProps> = ({ expedition, index }) => {
    const { t } = useTranslation();
    const { baseRoute, config, url } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const [modal, contextHolder] = useModal();
    const order = useSelector(selectOrderDetailsData);
    const isAttachmentDeleting = useSelector(selectAttachmentDeleting);

    const actionsData = useMemo(
        () => ({ order, expedition, url, baseRoute, privileges }),
        [order, expedition, url, baseRoute, privileges],
    );

    const defaultLines: { [key in ExpeditionAdditionalInfoDefaultLines]?: any } = {
        CREATED_BY: {
            path: ['expedition', 'created_by'],
            title: t('common.created_by'),
            render: ({ last_name, first_name }: ShortUser) =>
                last_name || first_name ? `${first_name} ${last_name}` : DEFAULT_DASH,
        },
    };

    const linesConfiguration =
        config.specific?.orderDetails?.tabs?.expedition?.additionalInfo ||
        SHORT_CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO;

    const additionalInfoConfig = useLineConfiguration(
        linesConfiguration,
        undefined,
        CONFIG_LINES__EXPEDITION_ADDITIONAL_INFO,
        defaultLines,
    );

    const { deleteExpeditionAttachment } = useActions(expeditionsActions);

    const onDelete = useCallback(
        (attachment) => {
            modal.confirm({
                title: t('modals.confirm_delete_expedition_attachment.title'),
                content: t('modals.confirm_delete_expedition_attachment.content'),
                okText: t('common.confirm'),
                cancelText: t('common.cancel'),
                okButtonProps: { loading: isAttachmentDeleting },
                cancelButtonProps: { loading: isAttachmentDeleting, className: 'tertiary' },
                onOk: () => {
                    deleteExpeditionAttachment({
                        attachmentId: attachment.id,
                        onSuccess: () =>
                            showSuccessNotification({
                                message: t('notifications.expedition_attachment_deleted_successfully.message'),
                                description: t('notifications.expedition_attachment_deleted_successfully.description'),
                            }),
                    });

                    return false;
                },
            });
        },
        [deleteExpeditionAttachment, isAttachmentDeleting, modal, t],
    );

    const actionsConfig = config?.specific?.orderDetails?.tabs?.expedition?.actions || EXPEDITION_ACTIONS;
    const maxSize = Number(config.specific?.files?.maxSize || MAX_SIZE);
    const formats = config.specific?.files?.formats?.join(',') || FORMATS;

    return (
        <PanelStyled>
            {contextHolder}
            <SpaceStyled size="middle">
                <LabelBoxStyled className={`${QA_EXPEDITION_HEADER_REFERENCE}${index}`} strong>
                    {showReference(expedition.reference)}
                </LabelBoxStyled>
                <AdditionalInfoTooltip
                    className={`${QA_EXPEDITION_HEADER_INFO}${index}`}
                    additionalInfoConfig={additionalInfoConfig}
                    data={{ expedition }}
                />
                <Divider type="vertical" />
                <Status
                    className={`${QA_EXPEDITION_HEADER_STATUS}${index}`}
                    group="orderExpedition"
                    code={expedition.status}
                />
            </SpaceStyled>
            <ActionsGroup>
                <div>
                    <Attachments
                        t={t}
                        className={`${QA_EXPEDITION_HEADER_ATTACHMENTS}${index}`}
                        attachments={expedition.attachments}
                        api={url}
                        emptyState={t('order_expedition_detailed.empty_attachments')}
                        onDelete={onDelete}
                    />

                    <CustomActions
                        className={`${QA_EXPEDITION_HEADER_ACTIONS}${index}`}
                        actionsConfig={actionsConfig}
                        data={actionsData}
                        refreshActionsMap={refreshActionsMap}
                        maxSize={maxSize}
                        formats={formats}
                        shape="circle"
                        t={t}
                    />
                </div>
            </ActionsGroup>
        </PanelStyled>
    );
};
