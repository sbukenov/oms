import React, { FC, useContext } from 'react';
import get from 'lodash/get';
import { useLineConfiguration } from '@bo/utils';

import type { OrderFull } from '~/models';
import { getModuleContext } from '~/utils';
import { SHORT_CONFIG_AMOUNTS__ORDER_DETAILS, CONFIG_AMOUNTS__ORDER_DETAILS, QA_TOTAL_AMOUNT } from '~/const';

import { FooterLineStyled, TextStyled, AmountStyled } from './OrderFooter.styled';

interface OrderFooterProps {
    order: OrderFull;
}

export const OrderFooter: FC<OrderFooterProps> = ({ order }) => {
    const { config } = useContext(getModuleContext());

    const totalAmounts =
        config?.specific?.orderDetails?.tabs?.synthesis?.totalAmounts || SHORT_CONFIG_AMOUNTS__ORDER_DETAILS;

    const amounts = useLineConfiguration(totalAmounts, order.currency, CONFIG_AMOUNTS__ORDER_DETAILS);

    if (!amounts.length) {
        return null;
    }

    return (
        <div>
            {amounts.map((amount, index) => {
                const itemData = get(order, amount.path);
                const result = amount.render ? amount.render(itemData, amount, index) : itemData;
                return (
                    <FooterLineStyled key={index}>
                        <TextStyled>{`${amount.title}:`}</TextStyled>
                        <AmountStyled className={`${QA_TOTAL_AMOUNT}${index}`}>{result}</AmountStyled>
                    </FooterLineStyled>
                );
            })}
        </div>
    );
};
