import React from 'react';
import styled from 'styled-components';
import { Color, antPrefix } from '@bo/component-library';
import Menu, { MenuProps } from 'antd/lib/menu';

export const MenuStyled = styled<React.ComponentType<MenuProps>>(Menu)`
    .${antPrefix}-dropdown-menu-item-active {
        color: ${Color.secondary(6)};
        path {
            stroke: ${Color.secondary(6)};
        }
    }
`;
