import { antPrefix, Icon, IconProps, Color } from '@bo/component-library';
import { StyledPageHeader } from '@-bo/keystone-components';
import { FC } from 'react';
import styled from 'styled-components';

export const PageHeaderStyled = styled(StyledPageHeader)`
    .${antPrefix}-page-header-heading {
        flex-wrap: nowrap;
    }

    .${antPrefix}-page-header-back-button {
        display: flex !important;
    }

    button {
        margin-right: 12px;
    }
`;

export const DateWrapper = styled.span`
    color: ${Color.neutral(5)};
    margin-right: 16px;

    svg {
        vertical-align: middle;
    }
`;

export const IconStyled = styled<FC<IconProps>>(Icon)`
    margin-right: 8px;
`;
