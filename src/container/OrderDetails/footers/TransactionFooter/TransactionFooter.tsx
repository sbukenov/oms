import React, { FC, useContext } from 'react';
import get from 'lodash/get';
import { useLineConfiguration } from '@bo/utils';

import { Transaction } from '~/models';
import { getModuleContext } from '~/utils';
import { CONFIG_AMOUNTS__TRANSACTION_DETAILS, SHORT_CONFIG_AMOUNTS__TRANSACTION_DETAILS } from '~/const';

import { FooterLineStyled, TextStyled, AmountStyled } from './TransactionFooter.styled';

interface TransactionFooterProps {
    transaction: Transaction;
    currency: string;
}

export const TransactionFooter: FC<TransactionFooterProps> = ({ transaction, currency }) => {
    const { config } = useContext(getModuleContext());

    const totalAmounts =
        config?.specific?.orderDetails?.tabs?.transaction?.totalAmounts || SHORT_CONFIG_AMOUNTS__TRANSACTION_DETAILS;

    const amounts = useLineConfiguration(totalAmounts, currency, CONFIG_AMOUNTS__TRANSACTION_DETAILS);

    if (!amounts.length) {
        return null;
    }

    return (
        <div>
            {amounts.map((amount, index) => {
                const itemData = get(transaction, amount.path);
                const result = amount.render ? amount.render(itemData, amount, index) : itemData;
                return (
                    <FooterLineStyled key={index}>
                        <TextStyled>{`${amount.title}:`}</TextStyled>
                        <AmountStyled>{result}</AmountStyled>
                    </FooterLineStyled>
                );
            })}
        </div>
    );
};
