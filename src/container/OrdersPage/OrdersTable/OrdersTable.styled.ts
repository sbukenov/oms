import React from 'react';
import styled from 'styled-components';
import Table, { TableProps } from 'antd/lib/table';
import { antPrefix } from '@bo/component-library';

import { Order } from '~/models';

export const TableStyled = styled<React.FC<TableProps<Order>>>(Table)`
    .${antPrefix}-table-content {
        overflow-x: auto;
    }
`;
