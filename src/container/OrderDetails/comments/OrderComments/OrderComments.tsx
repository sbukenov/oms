import React, { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { EditedComment } from '~/models';
import { useActions } from '~/hooks';
import { selectOrderDetails } from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import { EditCommentModal } from '~/components';

import { OrderCommentItem } from '../OrderCommentItem';

export const OrderComments: FC = () => {
    const { data } = useSelector(selectOrderDetails);
    const { deleteComment } = useActions(orderDetailsActions);
    const { t } = useTranslation();
    const [beingEditedComment, setBeingEditedComment] = useState<EditedComment>();

    const closeEditCommentModal = useCallback(() => setBeingEditedComment(undefined), []);

    return (
        <div>
            {data?.comments.map((comment, index) => (
                <OrderCommentItem
                    index={index}
                    key={comment.id}
                    t={t}
                    setEditedComment={setBeingEditedComment}
                    deleteComment={deleteComment}
                    {...comment}
                />
            ))}
            {!!beingEditedComment && (
                <EditCommentModal editedComment={beingEditedComment} close={closeEditCommentModal} />
            )}
        </div>
    );
};
