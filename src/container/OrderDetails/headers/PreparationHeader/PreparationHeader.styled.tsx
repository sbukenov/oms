import Text, { TextProps } from 'antd/lib/typography/Text';
import Space, { SpaceProps } from 'antd/lib/space';
import { Color } from '@bo/component-library';
import styled from 'styled-components';

import { ButtonBoldStyled } from '~/style/commonStyle';

export const ButtonStyled = styled(ButtonBoldStyled)`
    margin-right: 16px;
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

export const ActionsGroup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
