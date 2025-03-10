import styled from 'styled-components';
import React from 'react';
import Button, { ButtonProps } from 'antd/lib/button';

export const ButtonStyled = styled<React.FC<ButtonProps>>(Button)`
    border: none;
    background: none !important;
`;
