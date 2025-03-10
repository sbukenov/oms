import Text, { TextProps } from 'antd/lib/typography/Text';
import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const FooterLineStyled = styled.div`
    text-align: right;
`;

export const TextStyled = styled<React.FunctionComponent<TextProps>>(Text)`
    color: ${Color.neutral(7)};
    font-size: 16px;
    font-weight: 600;
`;

export const AmountStyled = styled<React.FunctionComponent<TextProps>>(Text)`
    display: inline-block;
    color: ${Color.neutral(7)};
    font-size: 16px;
    font-weight: 600;
    padding-right: 24px;
    width: 120px;
`;
