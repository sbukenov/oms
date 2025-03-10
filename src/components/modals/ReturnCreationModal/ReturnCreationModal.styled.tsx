import React from 'react';
import { antPrefix, Color, Icon, IconProps } from '@bo/component-library';
import styled, { keyframes } from 'styled-components';
import Modal from 'antd/lib/modal';
import Text, { TextProps } from 'antd/lib/typography/Text';
import Form, { FormProps } from 'antd/lib/form';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import Button, { ButtonProps } from 'antd/lib/button';

const greenLine = keyframes`
    from {background-color: ${Color.valid(3)};}
    to {background-color: ${Color.neutral(2)};}
`;

export const ModalStyled = styled(Modal)`
    width: 1050px !important;

    .${antPrefix}-table-row-level-1 {
        background-color: ${Color.neutral(2)};
        animation-name: ${greenLine};
        animation-duration: 3s;
        animation-timing-function: ease-in;
    }
    .${antPrefix}-btn-primary:disabled {
        background-color: ${Color.secondary(2)};
        color: white;
    }
`;

export const SpanStyled = styled.span`
    font-size: 22px;
    line-height: 24px;
`;

export const ReferenceWrapper = styled.span`
    color: ${Color.primary(6)};
    background-color: ${Color.royal_blue(1)};
    padding: 8px;
    border-radius: 4px;
    font-size: 15px;
    margin: 0 16px;
    line-height: 24px;
`;

export const StyledInputNumber = styled<React.FC<InputNumberProps>>(InputNumber)`
    & .${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;

export const IconStyled = styled<React.FC<IconProps>>(Icon)`
    margin-left: 8px;
    color: ${Color.primary(6)};
`;

export const FormStyled = styled<React.FC<FormProps>>(Form)`
    display: flex;
    justify-content: space-between;
    margin: 0 -12px;

    > div {
        padding: 0 12px;
        width: 330px;
        white-space: nowrap;
    }
    .${antPrefix}-form-item-explain-connected {
        position: absolute;
        top: 50px;
    }
    .${antPrefix}-form-item-row {
        display: block;
    }
    .${antPrefix}-form-item-label label {
        display: flex;
        justify-content: space-between;
    }
`;

export const ButtonStyled = styled<React.FC<ButtonProps>>(Button)`
    border: none;
    background: none !important;
`;

export const DescriptionWrapper = styled.div`
    display: flex;
    padding-bottom: 20px;
    line-height: 32px;
    justify-content: space-between;
`;

export const CounterWrapper = styled.div`
    display: flex;
`;

export const TextStyled = styled<React.FC<TextProps>>(Text)`
    color: ${Color.neutral(5)};
    padding-right: 16px;
`;

export const LabelStyled = styled.span`
    padding-left: 16px;
`;
