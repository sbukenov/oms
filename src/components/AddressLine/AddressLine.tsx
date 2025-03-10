import React from 'react';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';

import type { ShippingAddress } from '~/models';

interface AddressLineProps {
    address?: ShippingAddress;
}

export const AddressLine: React.FC<AddressLineProps> = ({ address }) => {
    const {
        i18n: { resolvedLanguage },
    } = useTranslation();

    if (!address?.line_1) return null;

    return (
        <div>
            <p>
                {[address.line_1, address.line_2, address.line_3].join(', ')}
                <br />
                {[address.city, address.postal_code].join(', ')}
                <br />
                {countries.getName(address.country_code, resolvedLanguage)}
            </p>
            <p>{address.comment}</p>
        </div>
    );
};
