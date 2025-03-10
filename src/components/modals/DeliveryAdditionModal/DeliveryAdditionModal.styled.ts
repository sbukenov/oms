import { antPrefix } from '@bo/component-library';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import Modal from 'antd/lib/modal/Modal';
import Table, { TableProps } from 'antd/lib/table';
import type { FC } from 'react';
import styled from 'styled-components';

import type { OrderLine } from '~/models';

export const StyledModal = styled(Modal)`
    width: 1312px !important;
`;

export const StyledModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    button {
        margin: 0 !important;
    }
`;

export const TableStyled = styled<FC<TableProps<OrderLine>>>(Table)`
    .${antPrefix}-table-content {
        overflow-x: auto;
    }
    td {
        height: 64px;
        padding: 0 !important;
    }
`;

export const StyledInputNumber = styled<FC<InputNumberProps<number>>>(InputNumber)`
    &.${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;

export const StyledRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 24px;
    & > div {
        flex: 1;
    }
`;
