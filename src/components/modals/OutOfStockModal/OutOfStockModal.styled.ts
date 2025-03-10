import { antPrefix, NumberInput } from '@bo/component-library';
import styled from 'styled-components';

export const StyledNumberInput = styled(NumberInput)`
    width: 100%;
    margin: 0;
    & .${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;

export const StyledModalBody = styled.div`
    & > *:last-child {
        margin-top: 32px;
    }
`;
