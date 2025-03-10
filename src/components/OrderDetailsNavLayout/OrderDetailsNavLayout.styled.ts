import styled from 'styled-components';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { Color } from '@bo/component-library';

export const CommonLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10rem;
`;

export const NavLinkWrapper = styled.div`
    display: flex;
`;

export const NavigationStyled = styled.nav`
    background-color: inherit;
    min-height: 50px;
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 40px;
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
