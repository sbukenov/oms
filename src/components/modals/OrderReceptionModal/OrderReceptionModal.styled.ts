import { antPrefix } from '@bo/component-library';
import Modal, { ModalProps } from 'antd/lib/modal';
import Table, { TableProps } from 'antd/lib/table';
import { FC } from 'react';
import styled from 'styled-components';

import { ReplenishmentOperation } from '~/models';

export const ModalStyled = styled<FC<ModalProps>>(Modal)`
    width: 646px !important;
    height: 600px !important;

    .${antPrefix}-modal-body {
        padding: 0;
    }

    .${antPrefix}-modal-content {
        border-radius: 4px;
        overflow: hidden;
    }
`;
export const ModalBody = styled.div`
    padding: 40px 32px 0 32px;
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
`;

export const TableStyled = styled<FC<TableProps<ReplenishmentOperation>>>(Table)`
    margin-bottom: 16px;

    .${antPrefix}-table-content {
        overflow-x: auto;
    }
`;
