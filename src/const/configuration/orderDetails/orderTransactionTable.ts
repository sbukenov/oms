import { CustomActionConfiguration, HTTPmethod } from '@bo/utils';

import type {
    OrderTransactionTableColumn,
    OrderTransactionTableDefaultColumns,
    OrderTransactionAmounts,
    OrderTransactionDefaultAmounts,
    TransactionAdditionalInfoDefaultLines,
    TransactionAdditionalInfoLines,
} from '~/models';

import { DEFAULT_DASH } from '../common';

export const SHORT_CONFIG_COLUMN__TRANSACTION_DETAILS: OrderTransactionTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'QUANTITY' },
    { column: 'UNIT_PRICE_EXCL_VAT' },
    { column: 'UNIT_PRICE_INCL_VAT' },
    { column: 'AMOUNT_EXCL_VAT' },
    { column: 'AMOUNT_INCL_VAT' },
    { column: 'AMOUNT' },
    { column: 'ACTION' },
];

export const CONFIG_COLUMN__TRANSACTION_DETAILS: {
    [key in OrderTransactionTableDefaultColumns]?: OrderTransactionTableColumn;
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
    UNIT_PRICE_EXCL_VAT: {
        custom: {
            path: 'unit_price_excluding_vat',
            title: {
                en: 'Unit price Excl.VAT',
                fr: 'Prix unitaire HT',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    UNIT_PRICE_INCL_VAT: {
        custom: {
            path: 'unit_price_including_vat',
            title: {
                en: 'Unit price Incl.VAT',
                fr: 'Prix unitaire TTC',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    AMOUNT_INCL_VAT: {
        custom: {
            path: 'amount_including_vat',
            title: {
                en: 'Amount Incl.VAT',
                fr: 'Total TTC',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
    AMOUNT: {
        custom: {
            path: 'vat_amount',
            title: {
                en: 'VAT amount',
                fr: 'Total TVA',
            },
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
            format: 'price',
        },
    },
};

export const SHORT_CONFIG_AMOUNTS__TRANSACTION_DETAILS: OrderTransactionAmounts[] = [
    { line: 'TOTAL_AMOUNT_EXCL_VAT' },
    { line: 'TOTAL_VAT' },
    { line: 'TOTAL_AMOUNT_INCL_VAT' },
];

export const CONFIG_AMOUNTS__TRANSACTION_DETAILS: {
    [key in OrderTransactionDefaultAmounts]?: OrderTransactionAmounts;
} = {
    TOTAL_AMOUNT_EXCL_VAT: {
        custom: {
            path: 'total_amounts.total_amount_excluding_vat',
            title: {
                en: 'Total excl. VAT',
                fr: 'Total HT',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    TOTAL_VAT: {
        custom: {
            path: 'total_amounts.total_vat',
            title: {
                en: 'Total VAT',
                fr: 'Total TVA',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
    TOTAL_AMOUNT_INCL_VAT: {
        custom: {
            path: 'total_amounts.total_amount_including_vat',
            title: {
                en: 'Total incl. VAT',
                fr: 'Total TTC',
            },
            format: 'price',
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const TRANSACTION_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'validate-refund',
        label: {
            en: 'Validate the refund',
            fr: 'Valider le remboursement',
        },
        privilege: 'oms-v2.transaction.transition',
        rules: {
            'transaction.status': {
                equals: 'CREATED',
            },
            'transaction.type': {
                equals: 'refund',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderTransactions', 'history'],
            request: {
                url: '{url}/transactions/{transaction.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'validate' },
            },
            content: {
                title: {
                    en: 'Validate the refund',
                    fr: 'Valider le remboursement',
                },
                body: {
                    en: 'Are you sure you want to validate the refund?',
                    fr: 'Êtes-vous sûr de vouloir valider ce remboursement?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The refund has been successfully validated',
                    fr: 'Le remboursement a bien été validé',
                },
            },
        },
    },
    {
        name: 'submit-transaction-redunding',
        label: {
            en: 'Submit the transaction for refunding',
            fr: 'Soumettre la transaction au remboursement',
        },
        privilege: 'oms-v2.transaction.transition',
        rules: {
            'transaction.status': {
                equals: 'VALIDATED',
            },
            'transaction.type': {
                equals: 'refund',
            },
            'transaction.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderTransactions', 'history'],
            request: {
                url: '{url}/transactions/{transaction.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'refund' },
            },
            content: {
                title: {
                    en: 'Submit the transaction for refunding',
                    fr: 'Soumettre la transaction au remboursement',
                },
                body: {
                    en: 'Are you sure you want to start refunding this transaction?',
                    fr: 'Êtes-vous sûr de vouloir procéder au remboursement de cette transaction ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The transaction refunding has been started',
                    fr: 'Le remboursement de la transaction a été lancé',
                },
            },
        },
    },
    {
        name: 'redund-transaction',
        label: {
            en: 'Refund the transaction',
            fr: 'Rembourser la transaction',
        },
        privilege: 'oms-v2.transaction.transition',
        rules: {
            'transaction.status': {
                equals: 'REFUNDING',
            },
            'transaction.type': {
                equals: 'refund',
            },
            'transaction.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderTransactions', 'history'],
            request: {
                url: '{url}/transactions/{transaction.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'complete' },
            },
            content: {
                title: {
                    en: 'Refund the transaction',
                    fr: 'Rembourser la transaction',
                },
                body: {
                    en: 'Are you sure you want to complete refunding of this transaction?',
                    fr: 'Êtes-vous sûr de vouloir completer le remboursement de cette transaction ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The transaction has been refunded',
                    fr: 'La transaction a été remboursée',
                },
            },
        },
    },
    {
        name: 'refuse-refund',
        icon: ['', 'close'],
        label: {
            en: 'Refuse the refund',
            fr: 'Refuser le remboursement',
        },
        privilege: 'oms-v2.transaction.transition',
        rules: {
            'transaction.status': {
                equals: 'CREATED',
            },
            'transaction.type': {
                equals: 'refund',
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderTransactions', 'history'],
            request: {
                url: '{url}/transactions/{transaction.id}',
                method: HTTPmethod.post,
                extra_payload: { transition: 'refuse' },
            },
            content: {
                title: {
                    en: 'Refuse the refund',
                    fr: 'Refuser le remboursement',
                },
                body: {
                    en: 'Are you sure you want to refuse the refund?',
                    fr: 'Êtes-vous sûr de vouloir refuser ce remboursement?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The refund has been successfully refused',
                    fr: 'Le remboursement a bien été refusé',
                },
            },
        },
    },
    {
        name: 'add-fee',
        icon: ['', 'add'],
        label: {
            en: 'Add fee',
            fr: 'Ajouter un frais',
        },
        privilege: 'oms-v2.transaction.create-fee',
        rules: {
            'transaction.cancelled_at': {
                equals: null,
            },
            'transaction.status': {
                not: {
                    oneOf: ['REFUNDING', 'REFUNDED', 'FAILED', 'REFUSED', 'VALIDATED'],
                },
            },
            'transaction.type': {
                equals: 'refund',
            },
        },
    },
    {
        name: 'cancel-transaction',
        icon: ['', 'close'],
        label: {
            en: 'Cancel the transaction',
            fr: 'Annuler la transaction',
        },
        privilege: 'oms-v2.transaction.cancel',
        rules: {
            'transaction.cancelled_at': {
                equals: null,
            },
            'transaction.status': {
                oneOf: ['CREATED', 'VALIDATED', 'REFUNDING'],
            },
        },
        custom: {
            refresh: ['orderDetails', 'history', 'orderTransactions'],
            request: {
                url: '{url}/transactions/{transaction.id}/cancellation',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Cancel the transaction',
                    fr: 'Annuler la transaction',
                },
                body: {
                    en: 'Are you sure you want to cancel the transaction?',
                    fr: 'Êtes-vous sûr de vouloir annuler cette transaction ?',
                },
                inputs: [
                    {
                        label: { en: 'Cancellation reason', fr: "Motif d'annulation" },
                        key: 'id',
                        type: 'select',
                        options: {
                            route: '{url}/cancellations/reasons?object[]=transaction&is_active=true',
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
                    en: 'The transaction has been successfully cancelled',
                    fr: 'La transaction a bien été annulée',
                },
            },
        },
    },
];

export const TRANSACTION_LINE_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'edit-fee',
        label: {
            en: 'Edit fee',
            fr: 'Edit fee',
        },
        rules: {
            'transaction.status': {
                equals: 'CREATED',
            },
            'transaction.cancelled_at': {
                equals: null,
            },
            'line.isFee': {
                equals: true,
            },
        },
    },
    {
        name: 'delete-fee',
        label: {
            en: 'Delete fee',
            fr: 'Supprimer les frais',
        },
        rules: {
            'transaction.status': {
                equals: 'CREATED',
            },
            'transaction.cancelled_at': {
                equals: null,
            },
            'line.isFee': {
                equals: true,
            },
        },
        custom: {
            refresh: ['orderTransactions'],
            request: {
                url: '{url}/transactions/{transaction.id}/fees/{line.id}',
                method: HTTPmethod.delete,
                extra_payload: { transition: 'validate' },
            },
            content: {
                title: {
                    en: 'Delete fee',
                    fr: 'Supprimer les frais',
                },
                body: {
                    en: 'Do you want to delete the fee? The total amount will be updated',
                    fr: 'Souhaitez-vous supprimer les frais ? Le montant total sera mis à jour',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The fee has been deleted',
                    fr: 'Les frais ont été supprimés',
                },
            },
        },
    },
];

export const SHORT_CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO: TransactionAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'UPDATED_AT' },
];

export const CONFIG_LINES__TRANSACTION_ADDITIONAL_INFO: {
    [key in TransactionAdditionalInfoDefaultLines]: TransactionAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Сréé le',
            },
            path: ['transaction', 'created_at'],
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
            path: ['transaction', 'updated_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};
