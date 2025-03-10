import { antPrefix, Color } from '@bo/component-library';
import Table, { TableProps } from 'antd/lib/table';
import Typography from 'antd/lib/typography';
import styled from 'styled-components';
import React from 'react';
import { StyledPageHeader } from '@-bo/keystone-components';

import type { FulfillmentItem } from '~/models';

export const PageHeaderStyled = styled(StyledPageHeader)`
    .${antPrefix}-page-header-heading-title {
        margin-right: 32px;
    }
`;

export const PickedValue = styled.span`
    color: ${Color.secondary(6)};
`;

export const InformationLine = styled(Typography.Text)`
    color: ${Color.neutral(6)};
    text-align: left;
    font-size: 14px;
    margin: 10px 0;
`;

export const StyledTable = styled<React.FunctionComponent<TableProps<FulfillmentItem>>>(Table)`
    margin-top: 24px;
    transition: visibility 0s, opacity 0.3s linear;

    tbody > tr > td {
        height: 80px;
    }
    tbody > tr > td:last-child > * {
        visibility: hidden;
        opacity: 0;
    }
    tbody > tr:hover > td:last-child > * {
        visibility: visible;
        opacity: 1;
    }
`;
