import { usePrivileges } from '@bo/utils';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getModuleContext } from '~/utils';

import { PRIVILEGE_ORDER_CREATE_COMMENT } from '~/const';
import { CollapsiblePanel, AddCommentForm } from '~/components';

import { OrderCommentsTitle } from '../OrderCommentsTitle';
import { OrderComments } from '../OrderComments';

interface CommentPanelProps {
    commentsCount?: number;
}

export const CommentPanel: FC<CommentPanelProps> = ({ commentsCount }) => {
    const { t } = useTranslation();
    const privileges = usePrivileges(getModuleContext());

    return (
        <CollapsiblePanel
            title={<OrderCommentsTitle title={t('order.comments.panel_title')} commentsCount={commentsCount} />}
        >
            {privileges?.has(PRIVILEGE_ORDER_CREATE_COMMENT) && <AddCommentForm />}
            <OrderComments />
        </CollapsiblePanel>
    );
};
