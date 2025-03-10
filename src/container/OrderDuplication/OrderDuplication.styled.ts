import { antPrefix } from '@bo/component-library';
import { StyledPageHeader } from '@bo/keystone-components';
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
