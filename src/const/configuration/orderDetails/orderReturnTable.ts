import { CustomActionConfiguration, HTTPmethod } from '@-bo/utils';

import type {
    OrderReturnTableColumn,
    OrderReturnTableDefaultColumns,
    ReturnAdditionalInfoDefaultLines,
    ReturnAdditionalInfoLines,
} from '~/models';
import { DEFAULT_DASH } from '~/const/configuration/common';

export const SHORT_CONFIG_COLUMN__RETURN_DETAILS: OrderReturnTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'EAN' },
    { column: 'STATUS' },
    { column: 'QUANTITY' },
    { column: 'REASON' },
];

export const CONFIG_COLUMN__RETURN_DETAILS: {
    [key in OrderReturnTableDefaultColumns]?: OrderReturnTableColumn;
} = {
    LABEL: {
        custom: {
            path: 'label',
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    EAN: {
        custom: {
            path: 'barcode',
            title: {
                en: 'EAN',
                fr: 'EAN',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    QUANTITY: {
        custom: {
            path: 'quantity',
            title: {
                en: 'Quantity',
                fr: 'Quantité',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
    REASON: {
        custom: {
            path: ['reason_type', 'label'],
            title: {
                en: 'Return reason',
                fr: 'Raison du retour',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const RETURN_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'validate-return',
        icon: ['', 'check'],
        label: {
            en: 'Validate the return',
            fr: 'Valider le retour',
        },
        rules: {
            'orderReturn.status': {
                equals: 'CREATED',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReturns', 'history'],
            request: {
                url: '{url}/returns/{orderReturn.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'validate' },
            },
            content: {
                title: {
                    en: 'Validate the return',
                    fr: 'Valider le retour',
                },
                body: {
                    en: 'Are you sure you want to validate the return?',
                    fr: 'Êtes-vous sûr de vouloir valider ce retour?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The return has been successfully validated',
                    fr: 'Le retour a bien été validé',
                },
            },
        },
    },
    {
        name: 'submit-return-qualification',
        label: {
            en: 'Submit return for qualification',
            fr: 'Soumettre le retour à la qualification',
        },
        rules: {
            'orderReturn.status': {
                equals: 'VALIDATED',
            },
            'orderReturn.cancelled_at': {
                equals: null,
            },
            'orderReturn.type': {
                equals: 'default',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReturns', 'history'],
            request: {
                url: '{url}/returns/{orderReturn.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'qualify' },
            },
            content: {
                title: {
                    en: 'Submit return for qualification',
                    fr: 'Soumettre le retour à la qualification',
                },
                body: {
                    en: 'Are you sure you want submit this return for qualification?',
                    fr: 'Êtes-vous sûr de vouloir soumettre  ce retour à la qualification ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The qualification of the return has been started',
                    fr: 'La qualification du retour a été lancée',
                },
            },
        },
    },
    {
        name: 'qualify-return',
        label: {
            en: 'Qualify the return',
            fr: 'Qualifier le retour',
        },
        rules: {
            'orderReturn.status': {
                equals: 'QUALIFIYING',
            },
            'orderReturn.cancelled_at': {
                equals: null,
            },
            'orderReturn.type': {
                equals: 'default',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReturns', 'history'],
            request: {
                url: '{url}/returns/{orderReturn.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'complete' },
            },
            content: {
                title: {
                    en: 'Qualify the return',
                    fr: 'Qualifier le retour',
                },
                body: {
                    en: 'Are you sure you want to complete qualification of this return?',
                    fr: 'Êtes-vous sûr de vouloir completer la qualification de ce retour ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The return has been qualified',
                    fr: 'Le retour a été qualifié',
                },
            },
        },
    },
    {
        name: 'refuse-return',
        icon: ['', 'close'],
        label: {
            en: 'Refuse the return',
            fr: 'Refuser le retour',
        },
        rules: {
            'orderReturn.status': {
                equals: 'CREATED',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderReturns', 'history'],
            request: {
                url: '{url}/returns/{orderReturn.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'refuse' },
            },
            content: {
                title: {
                    en: 'Refuse the return',
                    fr: 'Refuser le retour',
                },
                body: {
                    en: 'Are you sure you want to refuse the return?',
                    fr: 'Êtes-vous sûr de vouloir refuser ce retour?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The return has been successfully refused',
                    fr: 'Le retour a bien été refusé',
                },
            },
        },
    },
    {
        name: 'cancel-return',
        icon: ['', 'close'],
        label: {
            en: 'Cancel the return',
            fr: 'Annuler le retour',
        },
        rules: {
            'orderReturn.cancelled_at': {
                equals: null,
            },
            'orderReturn.status': {
                not: {
                    oneOf: ['QUALIFIED', 'REFUSED'],
                },
            },
            'orderReturn.type': {
                equals: 'default',
            },
        },
        custom: {
            refresh: ['orderDetails', 'history', 'orderReturns'],
            request: {
                url: '{url}/returns/{orderReturn.id}/cancellation',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Cancel the return',
                    fr: 'Annuler le retour',
                },
                body: {
                    en: 'Are you sure you want to cancel the return?',
                    fr: 'Êtes-vous sûr de vouloir annuler ce retour ?',
                },
                inputs: [
                    {
                        label: { en: 'Cancellation reason', fr: "Motif d'annulation" },
                        key: 'id',
                        type: 'select',
                        options: {
                            route: '{url}/cancellations/reasons?object[]=return&is_active=true',
                            fieldNames: {
                                value: 'id',
                                label: 'label',
                            },
                        },
                    },
                ],
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The return has been successfully cancelled',
                    fr: 'Le retour a bien été annulé',
                },
            },
        },
    },
];

export const SHORT_CONFIG_LINES__RETURN_ADDITIONAL_INFO: ReturnAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'UPDATED_AT' },
    { line: 'REASON' },
];

export const CONFIG_LINES__RETURN_ADDITIONAL_INFO: {
    [key in ReturnAdditionalInfoDefaultLines]: ReturnAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Сréé le',
            },
            path: ['orderReturn', 'created_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    UPDATED_AT: {
        custom: {
            title: {
                en: 'Updated at',
                fr: 'Modifié le',
            },
            path: ['orderReturn', 'updated_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    REASON: {
        custom: {
            title: {
                en: 'Return motive(s)',
                fr: 'Motif(s) du retour',
            },
            path: ['orderReturn', 'reason'],
            defaultValue: DEFAULT_DASH,
        },
    },
};
