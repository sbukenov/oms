import type { CustomerPanelLines, CustomerPanelDefaultLines } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_LINES__CUSTOMER_PANEL: CustomerPanelLines[] = [
    { line: 'NAME' },
    { line: 'PHONE' },
    { line: 'EMAIL' },
];

export const CONFIG_LINES__CUSTOMER_PANEL: {
    [key in CustomerPanelDefaultLines]?: CustomerPanelLines;
} = {
    NAME: {
        custom: {
            path: 'customer.name',
            title: {
                en: 'Customer name',
                fr: 'Nom du client',
            },
            icon: ['user'],
            defaultValue: DEFAULT_DASH,
        },
    },
    PHONE: {
        custom: {
            path: 'customer.phone_number',
            title: {
                en: 'Phone number',
                fr: 'Numéro de téléphone',
            },
            icon: ['phone'],
            defaultValue: DEFAULT_DASH,
        },
    },
};
