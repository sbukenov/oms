import { Color } from '@-bo/keystone-components';
import styled from 'styled-components';

export const ScrollableContainer = styled.div<{ isHeightFixed?: boolean }>`
    height: ${({ isHeightFixed }) => (isHeightFixed ? '400px' : 'inherit')};
    overflow-y: auto;

    .rc-virtual-list-holder {
        max-height: unset !important;
    }
    .rc-virtual-list-holder-inner div {
        padding: 0;
    }
`;

export const ProductColumns = styled.div`
    background: ${Color.neutral(2)};
    height: 32px;
    display: flex;

    span {
        flex: 1;
        font-weight: 600;
        padding: 0 8px;

        img {
            margin-right: 8px;
        }
    }
`;

export const ProductOption = styled.div`
    display: flex;
    height: 40px;
    align-items: center;

    span {
        flex: 1;
        padding: 0 8px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
`;

export const SpanStyled = styled.span`
    flex: 0 0 100px !important;
`;

export const dropdownAlignFixed = { overflow: { adjustX: false, adjustY: false } };
