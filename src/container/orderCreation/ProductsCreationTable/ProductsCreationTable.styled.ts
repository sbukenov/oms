import React from 'react';
import styled from 'styled-components';
import Table, { TableProps } from 'antd/lib/table';
import { antPrefix, Color } from '@bo/component-library';
import type { Product } from '~/models';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';

export const TableStyled = styled<React.FC<TableProps<Product>>>(Table)`
    .${antPrefix}-table-content {
        overflow-x: auto;
    }
    .${antPrefix}-table-row .${antPrefix}-table-cell {
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .${antPrefix}-table-selection-column {
        padding-left: 17px;
    }
    .${antPrefix}-dropdown-trigger span {
        color: ${Color.neutral(8)};
    }
`;

export const Wrapper = styled.div<{ 'data-disabled'?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 24px;

    opacity: ${(props) => (props['data-disabled'] ? '0' : '1')};
    max-height: ${(props) => (props['data-disabled'] ? '0' : '800px')};
    transition: max-height 300ms linear, opacity 400ms linear;
`;

export const StyledInputNumber = styled<React.FC<InputNumberProps<number>>>(InputNumber)`
    & .${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;
