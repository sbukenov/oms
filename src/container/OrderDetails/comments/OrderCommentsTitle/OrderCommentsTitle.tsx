import React from 'react';

import { Counter } from '~/style/commonStyle';
import { QA_COMMENTS_COUNTER } from '~/const';

import { CommentsTitleRoot } from './OrderCommentsTitle.styled';

interface OrderCommentsTitleProps {
    title: string;
    commentsCount?: number;
}

export const OrderCommentsTitle: React.FC<OrderCommentsTitleProps> = ({ title, commentsCount }) => {
    return (
        <CommentsTitleRoot>
            <span>{title}</span>
            {!!commentsCount && <Counter className={QA_COMMENTS_COUNTER}>{commentsCount}</Counter>}
        </CommentsTitleRoot>
    );
};
