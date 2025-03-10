import { NavLink, Link, NavLinkProps } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import React, { FC } from 'react';
import { Color, antPrefix, Icon, IconProps } from '@bo/component-library';
import Text, { TextProps } from 'antd/lib/typography/Text';
import Spin, { SpinProps } from 'antd/lib/spin';
import Space, { SpaceProps } from 'antd/lib/space';
import Form, { FormItemProps, FormProps } from 'antd/lib/form';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import Button, { ButtonProps } from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import Table, { TableProps } from 'antd/lib/table';

export const CommonLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10rem;
`;

export const NavLinkWrapper = styled.div`
    display: flex;
`;

export const SpinStyled: React.FC<SpinProps> = styled(Spin)`
    width: 100%;
    color: ${Color.primary(6)};
`;

export const NavLinkStyled: React.FC<NavLinkProps> = styled(NavLink)`
    color: ${Color.primary(6)};
    border-bottom: 2px solid rgba(88, 115, 181, 0.1);
    padding: 10px 20px;
    box-sizing: border-box;

    &.active {
        color: ${Color.primary(6)};
        border-bottom-color: ${Color.primary(6)};
        border-bottom-width: 4px;
        font-weight: 600;
    }

    &:not(:first-child) {
        margin-left: 3px;
    }

    &:hover {
        color: ${Color.primary(6)};
    }
`;

export const NavigationStyled = styled.nav`
    background-color: inherit;
    min-height: 50px;
    display: flex;
    justify-content: left;
    align-items: center;
`;

export const Spacer = styled.span`
    flex: 1;
`;

export const OverflowHiddenText = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const LabelBoxStyled = styled<React.FunctionComponent<TextProps>>(Text)`
    color: ${Color.primary(8)};
    background: ${Color.violette(2)};
    border-radius: 4px;
    padding: 8px;
    font-size: 16px;
`;

export const SpaceStyled = styled<React.FunctionComponent<SpaceProps>>(Space)`
    display: flex;

    div {
        display: flex;
    }
`;

export const OrderPanelsRow = styled(Space)`
    width: 100%;
    justify-content: center;
    & > div {
        flex: 1 0 0;
        width: 0;
    }
`;

export const Counter = styled.span`
    border-radius: 50%;
    height: 32px;
    width: 32px;
    background: ${Color.secondary(1)};
    color: ${Color.secondary(6)};
    font-weight: 600;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const FormStyled = styled<FC<FormProps>>(Form)`
    .${antPrefix}-form-item-row {
        display: block;
    }
`;

export const OMSGlobalStyles = createGlobalStyle`
    .overlay-with-white-arrow {
        &:before {
            content: ' ';
            height: 0;
            position: absolute;
            width: 0;
            left: -6px;
            top: 24px;
            border: 7px solid transparent;
            border-right-color: white;
            box-shadow: inherit;
        }
    }
`;

export const StyledLink = styled(Link)`
    color: ${Color.secondary(6)};
    text-decoration: underline;
`;

export const StyledInputNumber = styled<React.FC<InputNumberProps>>(InputNumber)`
    width: 100%;

    & .${antPrefix}-input-number-handler-wrap {
        opacity: 1;
    }
`;

export const ControlRow = styled(Space)`
    width: 100%;
    .${antPrefix}-input-affix-wrapper {
        max-width: 350px;
    }

    .${antPrefix}-space-item {
        &:nth-child(3) {
            display: flex;
            flex: 1;
        }
    }
`;

export const IconStyled = styled<FC<IconProps>>(Icon)`
    margin-right: 8px;
`;

export const RegularText = styled.span`
    font-size: 16px;
    color: ${Color.neutral(8)};
`;

export const ClearButton = styled<FC<ButtonProps>>(Button)`
    font-weight: 600;
`;

export const FiltersInfoLine = styled.div`
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StyledActionFormItem = styled<FC<FormItemProps>>(Form.Item)`
    .${antPrefix}-row {
        margin-right: 0;
        margin-left: 0;
    }
`;

export const ButtonBoldStyled = styled<React.FunctionComponent<ButtonProps>>(Button)`
    display: flex;
    align-items: center;
    font-weight: 400;
    gap: 8px;

    span {
        margin-right: 4px;
        font-weight: 600;
    }
`;

export const CustomButton = styled(ButtonBoldStyled)<{ 'data-active'?: boolean }>`
    background: ${(props) => (props['data-active'] ? Color.secondary(2) : '#fff')};
    border-color: ${(props) => (props['data-active'] ? Color.secondary(6) : Color.neutral(4))};
`;

export const ImageStyled = styled.img<{ $width?: number; $height?: number; $borderRadius?: string }>`
    width: ${({ $width }) => ($width ? $width : 48)}px;
    height: ${({ $height }) => ($height ? $height : 48)}px;
    border-radius: ${({ $borderRadius }) => ($borderRadius ? $borderRadius : '50%')};
`;

export const ActionsMenu = styled(Menu)`
    .${antPrefix}-dropdown-menu-item svg {
        margin-right: 8px;
    }
`;

export const LabelStyled = styled.div`
    display: flex;
    flex-direction: column;

    > span {
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        white-space: nowrap;
        padding-bottom: 4px;
    }
`;

export const TableSimpleStyled = styled<React.FC<TableProps<any>>>(Table)`
    margin: 30px 0;

    .${antPrefix}-table-content {
        overflow-x: auto;
    }
`;

export const TableStyled = styled(TableSimpleStyled)`
    tr td {
        cursor: pointer;
    }
`;

export const TableThinStyled = styled<React.FC<TableProps<any>>>(Table)`
    .${antPrefix}-table-content {
        overflow-x: auto;
    }
    .${antPrefix}-table-row .${antPrefix}-table-cell {
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .${antPrefix}-table-selection-column {
        padding-left: 17px;
    }
    .${antPrefix}-dropdown-trigger span {
        color: ${Color.neutral(8)};
    }
`;

export const HeaderStyled = styled.div`
    background: white;
    border-radius: 4px;
    padding: 16px;
    font-size: 16px;
    line-height: 24px;
    margin: 30px 0;
`;

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;
