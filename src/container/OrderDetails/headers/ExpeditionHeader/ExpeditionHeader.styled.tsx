import Space, { SpaceProps } from 'antd/lib/space';
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

export const ActionsGroup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
