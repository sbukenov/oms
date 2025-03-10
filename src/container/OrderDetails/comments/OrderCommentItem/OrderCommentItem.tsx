import { Tooltip } from 'antd';
import { Alert, Color, Icon, Icon } from '@bo/component-library';
import { SHORT_DATE_FORMAT, usePrivileges } from '@-bo/utils';
import dayjs from 'dayjs';
import React, { FC, useMemo, useCallback } from 'react';
import { TFunction } from 'react-i18next';

import {
    DEFAULT_DATE_FORMAT,
    HOUR_MINUTE_TIME_FORMAT,
    QA_COMMENT_DELETE_BUTTON,
    QA_COMMENT_EDIT_BUTTON,
    QA_COMMENT,
    QA_COMMENT_CREATED_AT,
    QA_COMMENT_RECIPIENT,
    QA_COMMENT_SENDER,
    QA_COMMENT_TITLE,
    PRIVILEGE_ORDER_UPDATE_COMMENT,
    PRIVILEGE_ORDER_DELETE_COMMENT,
} from '~/const';
import type { OrderComment, EditedComment } from '~/models';
import { Spacer } from '~/style/commonStyle';
import { getModuleContext } from '~/utils';

import {
    CommentRoot,
    AvatarContainer,
    CommentBody,
    CommentUser,
    CommentDate,
    CommentTitle,
    EditedSign,
    EmptyContent,
    DeleteCommentModalTitle,
    DeleteCommentModalContent,
    SpanStyled,
} from './OrderCommentItem.styled';

interface OrderCommentItemProps extends OrderComment {
    t: TFunction;
    setEditedComment: (comment: EditedComment) => void;
    deleteComment: (commentId: string) => void;
    index: number;
}

export const OrderCommentItem: FC<OrderCommentItemProps> = ({
    index,
    content,
    created_at,
    id,
    title,
    updated_at,
    user,
    setEditedComment,
    deleteComment,
    recipient,
    t,
}) => {
    const privileges = usePrivileges(getModuleContext());
    const isEdited = created_at !== updated_at;
    const date = useMemo(() => {
        const createdAt = dayjs(created_at);

        if (createdAt.isToday()) {
            return { value: `${t('common.today')}, ${createdAt.format(HOUR_MINUTE_TIME_FORMAT)}`, custom: true };
        }

        if (createdAt.isYesterday()) {
            return { value: `${t('common.yesterday')}, ${createdAt.format(HOUR_MINUTE_TIME_FORMAT)}`, custom: true };
        }

        return { value: createdAt.format(DEFAULT_DATE_FORMAT) };
    }, [created_at, t]);

    const onEditClick = useCallback(() => {
        setEditedComment({ id, content, title });
    }, [content, id, setEditedComment, title]);

    const confirmDeleteComment = useCallback(() => {
        Alert.confirm({
            style: {
                width: 400,
                height: 176,
            },
            cancelText: t('common.cancel'),
            okText: t('common.delete'),
            onOk: () => {
                deleteComment(id);
                return false;
            },
            title: <DeleteCommentModalTitle>{t('order.comments.delete_comment')}</DeleteCommentModalTitle>,
            content: (
                <DeleteCommentModalContent>{t('order.comments.delete_comment_warning')}</DeleteCommentModalContent>
            ),
            icon: <Icon type="system-feedback-error" style={{ color: Color.error(6), fontSize: 20 }} />,
        });
    }, [deleteComment, id, t]);

    const author = user ? `${user.first_name} ${user.last_name}` : 'Anonymous';

    return (
        <CommentRoot>
            <AvatarContainer />
            <CommentBody>
                <CommentUser>
                    <span className={`${QA_COMMENT_SENDER}${index}`}>{author}</span>
                    {!!recipient && (
                        <SpanStyled className={`${QA_COMMENT_RECIPIENT}${index}`}>to {recipient.label}</SpanStyled>
                    )}
                    {date.custom ? (
                        <Tooltip
                            className={`${QA_COMMENT_CREATED_AT}${index}`}
                            title={dayjs(created_at).format(SHORT_DATE_FORMAT)}
                        >
                            <CommentDate>{date.value}</CommentDate>
                        </Tooltip>
                    ) : (
                        <CommentDate className={`${QA_COMMENT_CREATED_AT}${index}`}>{date.value}</CommentDate>
                    )}
                    <Spacer />
                    {privileges?.has(PRIVILEGE_ORDER_UPDATE_COMMENT) && (
                        <button
                            className={`${QA_COMMENT_EDIT_BUTTON}${index}`}
                            data-name="edit_comment"
                            onClick={onEditClick}
                        >
                            <Icon name="edit" />
                        </button>
                    )}

                    {privileges?.has(PRIVILEGE_ORDER_DELETE_COMMENT) && (
                        <button
                            className={`${QA_COMMENT_DELETE_BUTTON}${index}`}
                            data-name="delete_comment"
                            onClick={confirmDeleteComment}
                        >
                            <Icon name="trash" />
                        </button>
                    )}
                </CommentUser>
                <CommentTitle className={`${QA_COMMENT_TITLE}${index}`}>{title}</CommentTitle>
                <div className={`${QA_COMMENT}${index}`}>
                    {content || <EmptyContent>({t('order.comments.empty')})</EmptyContent>}{' '}
                    {isEdited && <EditedSign>({t('order.comments.edited')})</EditedSign>}
                </div>
            </CommentBody>
        </CommentRoot>
    );
};
