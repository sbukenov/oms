import { Color } from '@bo/component-library';
import styled from 'styled-components';

export const Wrapper = styled.div<{ 'data-disabled'?: boolean }>`
    display: flex;
    position: relative;
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    padding-top: 24px;
    margin-bottom: 24px;
    width: 100%;
    background-color: ${Color.neutral(1)};
    color: ${(props) => (props['data-disabled'] ? Color.neutral(5) : Color.neutral(8))};
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(88, 115, 181, 0.05), 0 1px 2px rgba(88, 115, 181, 0.1);
    transition: color linear 800ms;
`;

export const BlockStyled = styled.div<{ 'data-disabled'?: boolean }>`
    display: flex;
    overflow: hidden;
    opacity: ${(props) => (props['data-disabled'] ? '0' : '1')};
    max-height: ${(props) => (props['data-disabled'] ? '0' : '1000px')};
    padding: ${(props) => (props['data-disabled'] ? '0' : '0 24px 24px')};
    line-height: 24px;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    transition: max-height 300ms linear, padding 300ms linear, color 800ms linear, opacity 400ms linear,
        border-color 800ms linear;
`;

export const LabelStyled = styled.div`
    font-weight: 600;
`;

export const Extra = styled.div`
    position: absolute;
    right: 24px;
    top: 17px;
    z-index: 10;
`;

export const FooterStyled = styled.div`
    width: 100%;
`;
