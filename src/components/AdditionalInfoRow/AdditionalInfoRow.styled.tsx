import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const RowRoot = styled.div`
    font-size: 12px;
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
        margin-bottom: 16px;
    }
`;

export const RowTitle = styled.span`
    font-weight: 600;
    color: ${Color.neutral(5)};
    width: 118px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;

    svg {
        margin-right: 10px;
    }
`;

export const RowValue = styled.span`
    font-weight: 400;
    color: ${Color.neutral(9)};
    width: 130px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
`;
