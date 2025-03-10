import { Color } from '@bo/component-library';
import { FC } from 'react';
import Button, { ButtonProps } from 'antd/lib/button';
import styled from 'styled-components';

export const SubmitButton = styled<FC<ButtonProps>>(Button)`
    &:disabled {
        background: ${Color.secondary(6)};
        color: white;
        opacity: 0.2;
    }
`;

export const SpaceStyled = styled.div`
    display: flex;
    justify-content: space-between;
    > div {
        flex: 1;
        padding: 0 16px;
    }
    > div:first-child {
        padding-left: 0;
    }
    > div:last-child {
        padding-right: 0;
    }
`;
