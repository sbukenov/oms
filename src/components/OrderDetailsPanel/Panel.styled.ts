import { antPrefix, Color, Icon, IconProps } from '@bo/component-library';
import styled from 'styled-components';
import Space from 'antd/lib/space';
import { FC } from 'react';

export const DetailsPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px 8px;
    height: 400px;
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(88, 115, 181, 0.05), 0 1px 2px rgba(88, 115, 181, 0.1);
    text-align: left;
    & > .${antPrefix}-typography {
        margin-bottom: 24px;
    }
`;

export const DetailsPanelHeader = styled.div`
    padding: 0 16px;
`;

export const DetailsPanelBody = styled.div`
    height: 330px;
    padding: 0 8px;
    margin: 0 8px;
    font-size: 14px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

export const DetailsPanelItem = styled(Space)`
    padding: 8px 0;
    word-break: break-word;

    svg {
        width: 18px;
        height: 18px;
    }
    & > *:last-child {
        flex: 1 0 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid ${Color.neutral(3)};
    }
`;

export const IconStyled = styled<FC<IconProps>>(Icon)`
    vertical-align: text-bottom;
    path {
        fill: ${Color.neutral(5)};
    }
`;
