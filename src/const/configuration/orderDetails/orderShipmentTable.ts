import { ActionType, CustomActionConfiguration, HTTPmethod } from '@bo/utils';

import type {
    OrderShipmentTableColumn,
    OrderShipmentTableDefaultColumns,
    ShipmentAdditionalInfoDefaultLines,
    ShipmentAdditionalInfoLines,
} from '~/models';
import { DEFAULT_DASH } from '~/const/configuration/common';

import { QA_DELIVERY_TABLE_LABEL, QA_DELIVERY_TABLE_QUANTITY, QA_DELIVERY_TABLE_REFERENCE } from '../../qa';

export const SHORT_CONFIG_COLUMN__SHIPMENT_DETAILS: OrderShipmentTableColumn[] = [
    { column: 'IMAGE' },
    { column: 'LABEL' },
    { column: 'REFERENCE' },
    { column: 'QUANTITY' },
];

export const CONFIG_COLUMN__SHIPMENT_DETAILS: {
    [key in OrderShipmentTableDefaultColumns]?: OrderShipmentTableColumn;
} = {
    LABEL: {
        custom: {
            path: 'label',
            title: {
                en: 'Product',
                fr: 'Produit',
            },
            className: QA_DELIVERY_TABLE_LABEL,
            defaultValue: DEFAULT_DASH,
        },
    },
    REFERENCE: {
        custom: {
            path: ['order_line', 'merchant_ref'],
            title: {
                en: 'Reference',
                fr: 'Référence',
            },
            className: QA_DELIVERY_TABLE_REFERENCE,
            defaultValue: DEFAULT_DASH,
        },
    },
    QUANTITY: {
        custom: {
            path: ['quantity', 'quantity'],
            title: {
                en: 'QTY',
                fr: 'QTE',
            },
            className: QA_DELIVERY_TABLE_QUANTITY,
            columnProps: {
                align: 'center',
            },
            defaultValue: DEFAULT_DASH,
        },
    },
};

export const SHIPMENT_ACTIONS: CustomActionConfiguration[] = [
    {
        name: 'cancel-shipment',
        icon: ['', 'close'],
        label: {
            en: 'Cancel the shipment',
            fr: "Annuler l'ordre de livraison",
        },
        privilege: 'oms-v2.shipment.cancel',
        rules: {
            'shipment.cancelled_at': {
                equals: null,
            },
            'shipment.status': {
                not: {
                    equals: 'DELIVERED',
                },
            },
            'order.status': {
                not: {
                    equals: 'COMPLETED',
                },
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}/cancellation',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Cancel the shipment',
                    fr: "Annuler l'ordre de livraison",
                },
                body: {
                    en: 'Are you sure you want to cancel that shipment?',
                    fr: 'Êtes-vous sûr de ne pas pouvoir annuler cet ordre de livraison?',
                },
                inputs: [
                    {
                        label: { en: 'Cancellation reason', fr: "Motif d'annulation" },
                        key: 'id',
                        type: 'select',
                        options: {
                            route: '{url}/cancellations/reasons?object[]=shipment&is_active=true',
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
                    en: 'The shipment has been succefully cancelled',
                    fr: "L'ordre de livraison a bien été annulé",
                },
            },
        },
    },
    {
        name: 'hand-over-to-carrier',
        label: {
            en: 'Hand over the delivery to the carrier',
            fr: 'Remettre la livraison au transporteur',
        },
        privilege: 'oms-v2.shipment.transition',
        rules: {
            'shipment.type': {
                equals: 'direct_delivery',
            },
            'shipment.status': {
                equals: 'TO_SHIP',
            },
            'shipment.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}',
                method: HTTPmethod.post,
                extra_payload: {
                    transition: 'give_to_carrier',
                },
            },
            content: {
                title: {
                    en: 'Hand over the delivery to the carrier',
                    fr: 'Remettre la livraison au transporteur',
                },
                body: {
                    en: 'Are you sure you want hand over the delivery to the carrier?',
                    fr: 'Êtes-vous sûr de vouloir remettre la livraison au transporteur ?',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The delivery has been handed to the carrier',
                    fr: 'La livraison a été remise au transporteur',
                },
            },
        },
    },
    {
        name: 'deliver-to-address',
        label: {
            en: 'Deliver to the address',
            fr: "Livrer à l'adresse",
        },
        privilege: 'oms-v2.shipment.transition',
        rules: {
            'shipment.type': {
                equals: 'direct_delivery',
            },
            'shipment.status': {
                equals: 'HANDED_TO_CARRIER',
            },
            'shipment.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}',
                method: HTTPmethod.post,
                extra_payload: {
                    transition: 'deliver',
                },
            },
            content: {
                title: {
                    en: 'Deliver to the address',
                    fr: "Livrer à l'adresse",
                },
                body: {
                    en: 'Are you sure you want start the delivery to the address?',
                    fr: "Êtes-vous sûr de vouloir lancer la livraison à l'adresse ?",
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The delivery to the address has been started',
                    fr: "La livraison à l'adresse a été lancée",
                },
            },
        },
    },
    {
        name: 'edit-tracking-link',
        icon: ['', 'edit'],
        label: {
            en: 'Edit tracking ID',
            fr: 'Modifier le lien de suivi',
        },
        privilege: 'oms-v2.shipment.update-tracking-link',
        rules: {
            'shipment.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}/tracking',
                method: HTTPmethod.put,
            },
            content: {
                title: {
                    en: 'Edit tracking link',
                    fr: 'Modifier le lien de suivi',
                },
                body: {
                    en: 'Please modify the link below',
                    fr: 'Veuillez  modifier le lien de tracking ci-dessous',
                },
                inputs: [
                    {
                        label: { en: 'Tracking link', fr: 'Le lien de suivi' },
                        key: 'tracking_link',
                        type: 'string',
                        initialValue: 'shipment.tracking_link',
                        fallbackValue: null,
                    },
                ],
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'Tracking link has been updated succefully',
                    fr: 'Le lien de suivi a bien été mis à jour',
                },
            },
        },
    },
    {
        name: 'upload-shipment-attachment',
        icon: ['', 'upload'],
        type: ActionType.upload,
        label: {
            en: 'Upload delivery proof',
            fr: 'Télécharger une preuve de livraison',
        },
        rules: {
            'shipment.cancelled_at': {
                equals: null,
            },
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}/attachment/upload',
                method: HTTPmethod.post,
            },
            content: {
                title: {
                    en: 'Delivery proof',
                    fr: 'Preuve de livraison',
                },
                body: {
                    en: 'Please upload a proof in one of the following formats: .jpg, .png, .pdf. The maximum size should not exceed 4 Mb.',
                    fr: 'Téléchargez une preuve dans un des formats suivants: .jpg, .png, .pdf. La taille maximum est limitée de 4 Mo.',
                },
                confirm: {
                    text: {
                        en: 'Upload',
                        fr: 'Télécharger',
                    },
                    icon: 'download',
                },
            },
            success_notification: {
                title: {
                    en: 'Uploaded successfully',
                    fr: 'Téléchargement réussi',
                },
                body: {
                    en: 'Delivery proof has been added',
                    fr: 'La preuve de livraison a été ajoutée',
                },
            },
        },
    },
    {
        name: 'download-delivery-note',
        icon: ['', 'download'],
        type: ActionType.download,
        label: {
            en: 'Download the delivery note',
            fr: 'Télécharger le bon de remise',
        },
        custom: {
            refresh: ['orderDetails', 'orderShipments', 'history'],
            request: {
                url: '{url}/shipments/{shipment.id}/download',
                method: HTTPmethod.get,
                mimeType: 'application/pdf',
                config: {
                    responseType: 'arraybuffer',
                },
            },
            success_notification: {
                title: {
                    en: 'Success',
                    fr: 'Succès',
                },
                body: {
                    en: 'The PDF document has been downloaded',
                    fr: 'Le fichier PDF a bien été téléchargé',
                },
            },
        },
    },
    {
        name: 'hand-over-the-shipment',
        label: {
            en: 'Hand over the delivery',
            fr: 'Remettre la livraison',
        },
        privilege: 'oms-v2.shipment.transition',
        rules: {
            'shipment.type': {
                equals: 'direct_delivery',
            },
            'shipment.status': {
                equals: 'DELIVERING',
            },
            'shipment.cancelled_at': {
                equals: null,
            },
        },
    },
];

export const SHORT_CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO: ShipmentAdditionalInfoLines[] = [
    { line: 'CREATED_AT' },
    { line: 'UPDATED_AT' },
    { line: 'EXPECTED_AT' },
];

export const CONFIG_LINES__SHIPMENT_ADDITIONAL_INFO: {
    [key in ShipmentAdditionalInfoDefaultLines]: ShipmentAdditionalInfoLines;
} = {
    CREATED_AT: {
        custom: {
            title: {
                en: 'Created at',
                fr: 'Сréé le',
            },
            path: ['shipment', 'created_at'],
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
            path: ['shipment', 'updated_at'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
    EXPECTED_AT: {
        custom: {
            title: {
                en: 'Expected at',
                fr: 'à livrer le',
            },
            path: ['shipment', 'expected_delivery_date'],
            format: 'date',
            defaultValue: DEFAULT_DASH,
        },
    },
};
