import type { CustomerPanelLines, CustomerPanelDefaultLines } from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_LINES__SUPPLIER_PANEL: CustomerPanelLines[] = [
    { line: 'NAME' },
    { line: 'PHONE' },
    { line: 'EMAIL' },
];

export const CONFIG_LINES__SUPPLIER_PANEL: {
    [key in CustomerPanelDefaultLines]?: CustomerPanelLines;
} = {
    NAME: {
        custom: {
            path: 'label',
            title: {
                en: 'Supplier name',
                fr: 'Nom fournisseur',
            },
            icon: ['user'],
            defaultValue: DEFAULT_DASH,
        },
    },
    PHONE: {
        custom: {
            path: ['entity_address', 'telephone'],
            title: {
                en: 'Phone number',
                fr: 'Numéro de téléphone',
            },
            icon: ['phone'],
            defaultValue: DEFAULT_DASH,
        },
    },
};
