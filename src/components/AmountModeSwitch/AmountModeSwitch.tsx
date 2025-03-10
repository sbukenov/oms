import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TransactionMode } from '~/models';

import { StyledButton, StyledSwitch } from './AmountModeSwitch.styled';

interface AmountModeSwitchProps {
    mode: TransactionMode;
    changeMode: (value: TransactionMode) => void;
}

export const AmountModeSwitch: FC<AmountModeSwitchProps> = ({ mode, changeMode }) => {
    const { t } = useTranslation();

    return (
        <StyledSwitch>
            <StyledButton
                isActive={mode === TransactionMode.add}
                onClick={() => changeMode(TransactionMode.add)}
                type="button"
            >
                {t('common.add')}
            </StyledButton>
            <StyledButton
                isActive={mode === TransactionMode.subtract}
                onClick={() => changeMode(TransactionMode.subtract)}
                type="button"
            >
                {t('common.subtract')}
            </StyledButton>
        </StyledSwitch>
    );
};
