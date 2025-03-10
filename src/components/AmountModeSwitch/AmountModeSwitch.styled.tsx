import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const StyledSwitch = styled.div`
    display: flex;
`;

export const StyledButton = styled.button<{ isActive: boolean }>`
    height: 48px;
    background-color: ${({ isActive }) => (isActive ? Color.secondary(6) : Color.neutral(1))};
    color: ${({ isActive }) => (isActive ? Color.neutral(1) : Color.neutral(8))};
    border: ${({ isActive }) => (isActive ? 'none' : `1px solid ${Color.neutral(4)}`)};
    cursor: pointer;
    padding: 12px 16px;

    :nth-child(1) {
        border-radius: 4px 0 0 4px;
    }
    :nth-child(2) {
        border-radius: 0 4px 4px 0;
    }
`;
