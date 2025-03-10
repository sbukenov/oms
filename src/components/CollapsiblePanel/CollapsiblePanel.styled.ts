import Collapse, { CollapseProps } from 'antd/lib/collapse';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { antPrefix } from '@bo/component-library';

export const CollapseRoot = styled<FunctionComponent<CollapseProps>>(Collapse)`
    padding: 16px 8px;
    margin-bottom: 16px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 4px 6px rgba(88, 115, 181, 0.05), 0px 1px 2px rgba(88, 115, 181, 0.1);
    border: none;
    text-align: left;

    .${antPrefix}-collapse-content {
        border: none;
    }

    .${antPrefix}-collapse-header {
        font-weight: 600;
        font-size: 20px;
        padding-left: 24px !important;
    }

    .${antPrefix}-collapse-header-text {
        flex: 1;
    }

    .${antPrefix}-collapse-item {
        border: none;
    }
`;
