import { Icon, Color } from '@bo/component-library';
import { getSelectedEntity } from '@-bo/utils';
import { DEFAULT_CURRENCY } from '@-bo/utils';
import { showPriceWithCurrency } from '@-bo/utils';
import Button from 'antd/lib/button';
import Tooltip from 'antd/lib/tooltip';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectOrderTotals, selectSupplierMinAmount } from '~/redux/selectors';

import { AmountStyled, FooterLineStyled, TextStyled } from './ProductsCreationTableFooter.styled';

export const ProductsCreationTableFooter: FC = () => {
    const {
        t,
        i18n: { resolvedLanguage: language },
    } = useTranslation();

    const { totalExclVat, totalVat, totalInclVat } = useSelector(selectOrderTotals);
    const minAmount = useSelector(selectSupplierMinAmount);

    const currency = getSelectedEntity()?.currency?.iso_code || DEFAULT_CURRENCY;
    const showWarning = minAmount > totalInclVat;

    return (
        <div>
            <FooterLineStyled>
                <TextStyled>{t('order_creation.product_table.total_excl_vat')}:</TextStyled>
                <AmountStyled>{showPriceWithCurrency(totalExclVat, currency, language)}</AmountStyled>
            </FooterLineStyled>
            <FooterLineStyled>
                <TextStyled>{t('order_creation.product_table.total_vat')}:</TextStyled>
                <AmountStyled>{showPriceWithCurrency(totalVat, currency, language)}</AmountStyled>
            </FooterLineStyled>
            <FooterLineStyled warning={showWarning}>
                {showWarning && (
                    <Tooltip
                        title={t('order_creation.min_total_is', {
                            amount: showPriceWithCurrency(minAmount, currency, language),
                        })}
                    >
                        <Button type="link">
                            <Icon name="alert" size="sm" color={Color.error(9)} />
                        </Button>
                    </Tooltip>
                )}
                <TextStyled>{t('order_creation.product_table.total_incl_vat')}:</TextStyled>
                <AmountStyled>{showPriceWithCurrency(totalInclVat, currency, language)}</AmountStyled>
            </FooterLineStyled>
        </div>
    );
};
