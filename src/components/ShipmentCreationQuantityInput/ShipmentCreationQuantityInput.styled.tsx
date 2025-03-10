import React from 'react';
import styled from 'styled-components';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import { antPrefix } from '@bo/component-library';

export const StyledInputNumber = styled<React.FC<InputNumberProps>>(InputNumber)`
    & .${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;
