import React from 'react';
import { Color, Icon } from '@bo/component-library';

import { ButtonStyled } from './DropDownButton.styled';

interface DropDownButtonProps<Type> {
    record: Type;
    expandable: boolean;
    onExpand: (record: Type, event: React.MouseEvent<HTMLElement>) => void;
}

export const DropDownButton: React.FC<DropDownButtonProps<any>> = ({ onExpand, record, expandable }) =>
    expandable ? (
        <ButtonStyled
            shape="circle"
            icon={<Icon name="dropdown-down" size="sm" color={Color.neutral(5)} />}
            onClick={(e) => onExpand(record, e)}
        />
    ) : null;
