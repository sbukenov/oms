import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const CommentRoot = styled.div`
    display: flex;
    padding: 24px 14px 0 14px;
`;

export const SpanStyled = styled.span`
    color: ${Color.neutral(7)};
    padding-left: 8px;
`;

export const AvatarContainer = styled.div`
    flex: 0 0 32px;
    margin-right: 24px;
`;

export const CommentBody = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${Color.neutral(3)};
    padding-bottom: 24px;
`;

export const CommentUser = styled.div`
    font-weight: 600;
    color: ${Color.primary(6)};
    width: 100%;
    display: flex;
    align-items: center;

    & button {
        background: transparent;
        border: none;
        cursor: pointer;
    }

    &button[data-name='edit_comment'] {
        margin-right: 18px;
    }
`;

export const CommentDate = styled.span`
    font-weight: 400;
    color: ${Color.neutral(5)};
    font-size: 14px;
    margin-left: 10px;
`;

export const CommentTitle = styled.div`
    font-weight: 600;
`;

export const EditedSign = styled.span`
    font-weight: 400;
    color: ${Color.neutral(5)};
    font-size: 14px;
`;

export const EmptyContent = styled.span`
    font-weight: 400;
    color: ${Color.neutral(5)};
    font-size: 14px;
`;

export const DeleteCommentModalTitle = styled.span`
    color: ${Color.error(6)};
    font-size: 14px;
`;

export const DeleteCommentModalContent = styled.span`
    color: ${Color.neutral(6)};
    font-size: 14px;
`;
