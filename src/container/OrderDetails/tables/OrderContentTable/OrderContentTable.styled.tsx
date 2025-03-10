import Text, { TextProps } from 'antd/lib/typography/Text';
import styled from 'styled-components';
import { Color } from '@bo/component-library';

export const TextStyled = styled<React.FC<TextProps>>(Text)`
    color: ${Color.primary(8)};
`;
