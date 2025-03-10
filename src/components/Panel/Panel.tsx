import React, { FC } from 'react';
import { Icon, IconNames } from '@bo/component-library';

import { BlockStyled, LabelStyled, Wrapper, Extra, FooterStyled } from './Panel.styled';

export interface PanelProps {
    disabled?: boolean;
    iconName: IconNames;
    label: string;
    extra?: React.ReactNode;
    footer?: React.ReactNode;
}

export const Panel: FC<PanelProps> = ({ disabled, children, iconName, label, extra, footer }) => {
    return (
        <Wrapper data-disabled={disabled}>
            {!!extra && <Extra>{extra}</Extra>}
            <BlockStyled>
                <Icon name={iconName} />
                <LabelStyled>{label}</LabelStyled>
            </BlockStyled>
            <BlockStyled data-disabled={disabled}>{children}</BlockStyled>
            <FooterStyled>{footer}</FooterStyled>
        </Wrapper>
    );
};
