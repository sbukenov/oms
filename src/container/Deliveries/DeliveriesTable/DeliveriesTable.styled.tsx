import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from 'antd/lib/button';

export const ButtonStyled = styled<React.FC<ButtonProps>>(Button)`
    span {
        text-decoration: underline;
    }
`;
