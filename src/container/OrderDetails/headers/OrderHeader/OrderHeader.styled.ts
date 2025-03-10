import React from 'react';
import styled from 'styled-components';
import { Color, antPrefix, Icon, IconProps } from '@bo/component-library';
import { StyledPageHeader } from '@-bo/keystone-components';

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

    svg {
        vertical-align: middle;
    }
`;

export const ReferenceWrapper = styled.span`
    color: ${Color.primary(6)};
    background-color: ${Color.royal_blue(1)};
    padding: 4px 8px;
    border-radius: 4px;
`;

export const IconStyled = styled<React.FC<IconProps>>(Icon)`
    margin-right: 8px;
`;
