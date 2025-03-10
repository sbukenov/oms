import React from 'react';
import Space, { SpaceProps } from 'antd/lib/space';
import styled from 'styled-components';

export const LabelStyled = styled<React.FC<SpaceProps>>(Space)`
    display: flex;
    div {
        display: flex;
    }
`;
