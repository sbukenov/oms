import { antPrefix, Color, BreakPoint } from '@bo/component-library';
import { DatePicker } from '@bo/keystone-components';
import styled from 'styled-components';

export const DatePickerStyled = styled(DatePicker)`
    svg {
        color: ${Color.neutral(8)};
    }
`;

export const Wrapper = styled.div`
    margin-top: 10rem;
    margin-bottom: 360px;
    transition: color linear 800ms;

    .${antPrefix}-row {
        flex: 1;
    }
`;

export const ConditionsWrapper = styled.div`
    background: ${Color.neutral(2)};
    padding: 16px;
    font-size: 14px;
    margin-top: 25px;

    th {
        padding-right: 8px;
        font-weight: 600;
    }
`;

export const DatesBlock = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 16px;
    justify-content: space-between;
    gap: 16px;

    > div {
        flex-grow: 1;
    }
`;

export const TextStyled = styled.div`
    display: flex;
    align-items: center;
    height: auto;
    font-size: 16px;

    svg {
        margin-left: 8px;
    }
`;

export const SupplierLeftBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: calc(50vw - 100px);

    @media (max-width: ${BreakPoint.md}) {
        width: inherit;
    }
`;

export const SupplierStyled = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 16px;
    flex: 1;

    @media (max-width: ${BreakPoint.md}) {
        flex-direction: column;
    }
`;
