import { getRawAmountValue } from '@bo/utils';

import type { Packaging, Product, ProductInformation } from '~/models';

import { getProductPrice, getValueAndPrecisionFromNumber } from './helpers';

export const getPricesAndAmounts = (quantity: number, price?: Packaging['price']) => {
    const definedPrice = getProductPrice(price, quantity);
    const vatRate = getRawAmountValue(price?.vat_rate);

    return {
        quantity,
        amount_excluding_vat: getValueAndPrecisionFromNumber(definedPrice * quantity),
        amount_including_vat: getValueAndPrecisionFromNumber(
            (definedPrice + (definedPrice / 100) * vatRate) * quantity,
        ),
        vat_amount: getValueAndPrecisionFromNumber(
            (definedPrice + (definedPrice / 100) * vatRate) * quantity - definedPrice * quantity,
        ),
        unit_price_excluding_vat: getValueAndPrecisionFromNumber(definedPrice),
        unit_price_including_vat: getValueAndPrecisionFromNumber(definedPrice + (definedPrice / 100) * vatRate),
    };
};

export const mapPackagingToProduct = (packaging: Packaging): Product => {
    return {
        product: packaging.packaging_product as ProductInformation,
        packagings: [],
        selectedPackaging: { ...packaging },
        ...getPricesAndAmounts(packaging.min_quantity || 1, packaging.price),
    };
};
