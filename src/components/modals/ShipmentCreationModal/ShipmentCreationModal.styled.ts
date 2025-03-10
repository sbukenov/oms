import styled from 'styled-components';
import Modal from 'antd/lib/modal';
import Table, { TableProps } from 'antd/lib/table';
import Space, { SpaceProps } from 'antd/lib/space';
import Typography from 'antd/lib/typography';
import { FC } from 'react';
import { antPrefix, Color } from '@bo/component-library';
import { FulfillmentItem } from '~/models';

export const StyledModal = styled(Modal)`
    width: 1038px !important;
`;

export const LabelStyled = styled<FC<SpaceProps>>(Space)`
    display: flex;
    div {
        display: flex;
    }
`;

export const ReferenceWrapper = styled.span`
    color: ${Color.primary(6)};
    background-color: ${Color.royal_blue(1)};
    padding: 8px;
    border-radius: 4px;
    font-size: 15px;
    margin: 0 16px;
    line-height: 24px;
`;

export const StyledTable = styled<FC<TableProps<FulfillmentItem>>>(Table)`
    .${antPrefix}-table-cell {
        padding: 8px 16px;
    }
`;

export const StyledText = styled(Typography.Text)`
    display: flex;
    align-items: center;
`;

export const ActionTextContent = styled.div`
    display: flex;
    margin-bottom: 24px;
    justify-content: space-between;
`;

export const CounterWrapper = styled.span`
    display: flex;
    align-items: center;
    color: ${Color.neutral(5)};

    span {
        margin-left: 16px;
    }
`;
