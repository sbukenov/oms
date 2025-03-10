import React from 'react';
import { IconNames, Icon } from '@bo/component-library';

import { ButtonStyled } from './TooltipIconButton.styled';
import Tooltip from 'antd/lib/tooltip';

interface TooltipIconButtonProps {
    title: string;
    iconName: IconNames;
    onClick: () => void;
    disabled?: boolean;
}

export const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({ title, iconName, onClick, disabled }) => (
    <Tooltip placement="top" title={title}>
        <ButtonStyled shape="circle" icon={<Icon name={iconName} />} onClick={onClick} disabled={disabled} />
    </Tooltip>
);
