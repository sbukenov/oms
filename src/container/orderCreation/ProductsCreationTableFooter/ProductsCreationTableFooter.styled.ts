import Text, { TextProps } from 'antd/lib/typography/Text';
import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const FooterLineStyled = styled.div<{ warning?: boolean }>`
    text-align: right;

    span {
        color: ${({ warning }) => (warning ? Color.error(9) : Color.neutral(8))};
    }

    button {
        padding: 0;
        height: auto;
        margin-right: 4px;
    }
`;

export const TextStyled = styled<React.FC<TextProps>>(Text)`
    color: ${Color.neutral(7)};
    font-size: 16px;
    font-weight: 600;
`;

export const AmountStyled = styled<React.FC<TextProps>>(Text)`
    display: inline-block;
    color: ${Color.neutral(7)};
    font-size: 16px;
    font-weight: 600;
    padding-right: 24px;
    width: 120px;
`;
