import Collapse, { CollapseProps } from 'antd/lib/collapse';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { antPrefix } from '@bo/component-library';

export const CollapseRoot = styled<FunctionComponent<CollapseProps>>(Collapse)`
    padding: 0;
    border-radius: 8px;
    background: #fff;
    border: none;
    text-align: left;
    box-shadow: none;
    margin-bottom: 16px;

    .${antPrefix}-collapse-item {
        border-bottom: none;
    }

    .${antPrefix}-collapse-content {
        border-top: none;
        padding-top: 16px;
    }
    .${antPrefix}-collapse-content-box {
        padding: 0;
    }

    .${antPrefix}-collapse-header {
        justify-content: space-between;
        padding: 0 !important;
        font-weight: 600;
        color: #5873b5 !important;
    }

    .${antPrefix}-collapse-expand-icon {
        order: 1;
    }
`;
