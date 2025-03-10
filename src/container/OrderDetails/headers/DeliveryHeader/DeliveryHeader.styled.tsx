import Text, { TextProps } from 'antd/lib/typography/Text';
import Space, { SpaceProps } from 'antd/lib/space';
import Button, { ButtonProps } from 'antd/lib/button';
import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const ButtonStyled = styled<React.FunctionComponent<ButtonProps>>(Button)`
    span {
        text-decoration: underline;
    }
`;

export const PanelStyled = styled<React.FunctionComponent<SpaceProps>>(Space)`
    display: flex;
    justify-content: space-between;
    padding: 16px;
`;

export const TextStyled = styled<React.FunctionComponent<TextProps>>(Text)`
    display: flex;
    align-items: center;
    color: ${Color.neutral(5)};
    font-size: 14px;
`;
