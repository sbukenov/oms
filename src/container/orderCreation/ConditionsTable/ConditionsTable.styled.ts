import { Color, BreakPoint } from '@bo/component-library';
import styled from 'styled-components';

export const ConditionsWrapper = styled.div`
    flex-grow: 1;
    background: ${Color.neutral(2)};
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 18px;
    width: calc(50vw - 100px);

    th {
        padding-right: 8px;
        font-weight: 600;
    }

    @media (max-width: ${BreakPoint.md}) {
        width: inherit;
    }
`;
