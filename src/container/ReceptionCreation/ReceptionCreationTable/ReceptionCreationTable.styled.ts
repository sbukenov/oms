import { antPrefix, Color } from '@bo/component-library';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import Table, { TableProps } from 'antd/lib/table';
import type { FC } from 'react';
import styled from 'styled-components';

import type { LogisticUnit, UnexpectedLogisticUnit } from '~/models';

export const TableStyled = styled<FC<TableProps<LogisticUnit | UnexpectedLogisticUnit>>>(Table)`
    margin-top: 10rem;
    .${antPrefix}-table-content {
        overflow-x: auto;
    }

    tr.red td {
        background: ${Color.lily(1)} !important;
    }
    tr.red:hover td {
        background: ${Color.lily(1)} !important;
    }
`;

export const StyledInputNumber = styled<FC<InputNumberProps<number>>>(InputNumber)`
    width: 80px;
    &.${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;
