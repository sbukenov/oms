import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
    getSelectedProducts,
    isOrderUpdating,
    orderLinesChanged,
    selectOrderTotals,
    selectSupplierMinAmount,
} from '~/redux/selectors';
import { ButtonBoldStyled } from '~/style/commonStyle';

interface OrderEditionExtraProps {
    onBack: () => void;
    onSave: () => void;
}

export const OrderEditionExtra: FC<OrderEditionExtraProps> = ({ onBack, onSave }) => {
    const { t } = useTranslation();

    const selectedProducts = useSelector(getSelectedProducts);
    const changed = useSelector(orderLinesChanged);
    const isUpdating = useSelector(isOrderUpdating);
    const { totalInclVat } = useSelector(selectOrderTotals);
    const minAmount = useSelector(selectSupplierMinAmount);

    const shouldDisableSubmit = useMemo(() => {
        if (!selectedProducts.length) return true;
        return minAmount > totalInclVat;
    }, [minAmount, selectedProducts.length, totalInclVat]);

    return (
        <>
            <ButtonBoldStyled onClick={onBack} loading={isUpdating}>
                {t('common.cancel')}
            </ButtonBoldStyled>
            <ButtonBoldStyled
                onClick={onSave}
                type="primary"
                disabled={!changed || shouldDisableSubmit}
                loading={isUpdating}
            >
                {t('common.save_changes')}
            </ButtonBoldStyled>
        </>
    );
};
