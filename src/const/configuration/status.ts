import { Color } from '@bo/component-library';

import { StatusesByStatusGroup } from '~/models';

export const STATUSES: StatusesByStatusGroup = {
    order: {
        CREATED: {
            color: Color.neutral(6),
            title: {
                en: 'Created',
                fr: 'Créée',
            },
        },
        DRAFT: {
            color: Color.neutral(6),
            title: {
                en: 'Draft',
                fr: 'Brouillon',
            },
        },
        CONFIRMED: {
            color: Color.royal_blue(6),
            title: {
                en: 'Confirmed',
                fr: 'Confirmée',
            },
        },
        PROCESSING: {
            color: Color.warning(5),
            title: {
                en: 'Processing',
                fr: 'En cours',
            },
        },
        READY: {
            color: Color.valid(6),
            title: {
                en: 'Ready',
                fr: 'Prête',
            },
        },
        COMPLETED: {
            color: Color.valid(7),
            title: {
                en: 'Completed',
                fr: 'Terminée',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    orderExpedition: {
        AWAITING_RECEPTION: {
            color: Color.neutral(6),
            title: {
                en: 'Awaiting expedition',
                fr: 'En attente de expédition',
            },
        },
        RECEIVING: {
            color: Color.warning(5),
            title: {
                en: 'Receiving',
                fr: 'En cours de expédition',
            },
        },
        PARTIALLY_RECEIVED: {
            color: Color.valid(6),
            title: {
                en: 'Partially received',
                fr: 'Partiellement reçu',
            },
        },
        RECEIVED: {
            color: Color.valid(7),
            title: {
                en: 'Received',
                fr: 'Reçu',
            },
        },
        REFUSED: {
            color: Color.error(8),
            title: {
                en: 'Refused',
                fr: 'Refusé',
            },
        },
    },
    orderReception: {
        AWAITING_RECEPTION: {
            color: Color.neutral(6),
            title: {
                en: 'Awaiting reception',
                fr: 'En attente de réception',
            },
        },
        RECEIVING: {
            color: Color.warning(5),
            title: {
                en: 'Receiving',
                fr: 'En cours de réception',
            },
        },
        PARTIALLY_RECEIVED: {
            color: Color.valid(6),
            title: {
                en: 'Partially received',
                fr: 'Partiellement reçu',
            },
        },
        RECEIVED: {
            color: Color.valid(7),
            title: {
                en: 'Received',
                fr: 'Reçu',
            },
        },
        REFUSED: {
            color: Color.error(8),
            title: {
                en: 'Refused',
                fr: 'Refusé',
            },
        },
    },
    orderFulfillment: {
        AWAITING_FULFILLMENT: {
            color: Color.neutral(6),
            title: {
                en: 'Awaiting fulfillment',
                fr: 'En attente de préparation',
            },
        },
        TO_PREPARE: {
            color: Color.royal_blue(6),
            title: {
                en: 'To prepare',
                fr: 'À préparer',
            },
        },
        PREPARING: {
            color: Color.warning(5),
            title: {
                en: 'Preparing',
                fr: 'En cours de préparation',
            },
        },
        PARTIALLY_PICKED: {
            color: Color.valid(6),
            title: {
                en: 'Partially picked',
                fr: 'Partiellement préparé',
            },
        },
        PICKED: {
            color: Color.valid(7),
            title: {
                en: 'Picked',
                fr: 'Préparé',
            },
        },
        PREPARATION_REFUSED: {
            color: Color.error(8),
            title: {
                en: 'Preparation refused',
                fr: 'Préparation refusée',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    orderShipment: {
        AWAITING_SHIPMENT: {
            color: Color.neutral(6),
            title: {
                en: 'Awaiting shipment',
                fr: 'En attente de livraison',
            },
        },
        TO_DELIVER: {
            color: Color.royal_blue(6),
            title: {
                en: 'To deliver',
                fr: 'À livrer',
            },
        },
        DELIVERING: {
            color: Color.warning(5),
            title: {
                en: 'Delivering',
                fr: 'En cours de livraison',
            },
        },
        PARTIALLY_DELIVERED: {
            color: Color.valid(6),
            title: {
                en: 'Partially delivered',
                fr: 'Partiellement livrée',
            },
        },
        DELIVERED: {
            color: Color.valid(7),
            title: {
                en: 'Delivered',
                fr: 'Livrée',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    fulfillment: {
        TO_PREPARE: {
            color: Color.royal_blue(6),
            title: {
                en: 'To prepare',
                fr: 'À préparer',
            },
        },
        PREPARING: {
            color: Color.warning(5),
            title: {
                en: 'Preparing',
                fr: 'En cours de préparation',
            },
        },
        PARTIALLY_PICKED: {
            color: Color.valid(6),
            title: {
                en: 'Partially prepared',
                fr: 'Partiellment préparé',
            },
        },
        PICKED: {
            color: Color.valid(7),
            title: {
                en: 'Prepared',
                fr: 'Préparé',
            },
        },
        UNABLE_TO_PREPARE: {
            color: Color.error(8),
            title: {
                en: 'Unable to prepare',
                fr: 'Impossible à préparer',
            },
        },
        REASSIGNED: {
            color: Color.error(8),
            title: {
                en: 'Reassigned',
                fr: 'Réaffecté',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    shipment: {
        TO_SHIP: {
            color: Color.royal_blue(6),
            title: {
                en: 'To ship',
                fr: 'À expédié',
            },
        },
        HANDED_TO_CARRIER: {
            color: Color.valid(6),
            title: {
                en: 'Handed to carrier',
                fr: 'Expédié',
            },
        },
        DELIVERING: {
            color: Color.warning(5),
            title: {
                en: 'Delivering',
                fr: 'En cours de livraison',
            },
        },
        PARTIALLY_DELIVERED: {
            color: Color.valid(6),
            title: {
                en: 'Partially delivered',
                fr: 'Partiellement livrée',
            },
        },
        DELIVERED: {
            color: Color.valid(7),
            title: {
                en: 'Delivered',
                fr: 'Livré',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    return: {
        CREATED: {
            color: Color.neutral(6),
            title: {
                en: 'Created',
                fr: 'Crée',
            },
        },
        REFUSED: {
            color: Color.error(8),
            title: {
                en: 'Refused',
                fr: 'Refusé',
            },
        },
        VALIDATED: {
            color: Color.royal_blue(6),
            title: {
                en: 'Validated',
                fr: 'Validé',
            },
        },
        QUALIFIYING: {
            color: Color.valid(6),
            title: {
                en: 'Qualifiying',
                fr: 'En qualification',
            },
        },
        QUALIFIED: {
            color: Color.valid(7),
            title: {
                en: 'Qualified',
                fr: 'Qualifié',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    fulfillmentItem: {
        TO_PROCESS: {
            color: Color.royal_blue(6),
            title: {
                en: 'To process',
                fr: 'À traiter',
            },
        },
        PROCESSING: {
            color: Color.warning(5),
            title: {
                en: 'Processing',
                fr: 'En cours de traitement',
            },
        },
        PROCESSED: {
            color: Color.valid(6),
            title: {
                en: 'Processed',
                fr: 'Traité',
            },
        },
        UNABLE_TO_PROCESS: {
            color: Color.error(8),
            title: {
                en: 'Unable to process',
                fr: 'Impossible à traiter',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    returnItem: {
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
    picking: {
        PICKED: {
            color: Color.valid(6),
            title: {
                en: 'Picked',
                fr: 'Préparé',
            },
        },
        OUT_OF_STOCK: {
            color: Color.error(8),
            title: {
                en: 'Out of stock',
                fr: 'Rupture de stock',
            },
        },
        SUBSTITUTE: {
            color: Color.warning(5),
            title: {
                en: 'Substitute',
                fr: 'Substituant',
            },
        },
    },
    transaction: {
        CREATED: {
            color: Color.neutral(6),
            title: {
                en: 'Created',
                fr: 'Crée',
            },
        },
        REFUSED: {
            color: Color.error(8),
            title: {
                en: 'Refused',
                fr: 'Refusé',
            },
        },
        VALIDATED: {
            color: Color.royal_blue(6),
            title: {
                en: 'Validated',
                fr: 'Validé',
            },
        },
        REFUNDING: {
            color: Color.valid(6),
            title: {
                en: 'Refunding',
                fr: 'En cours de remboursement',
            },
        },
        REFUNDED: {
            color: Color.valid(7),
            title: {
                en: 'Refunded',
                fr: 'Remboursé',
            },
        },
        FAILED: {
            color: Color.error(8),
            title: {
                en: 'Failed',
                fr: 'Échoué',
            },
        },
        CANCELLED: {
            color: Color.error(8),
            title: {
                en: 'Cancelled',
                fr: 'Annulée',
            },
        },
    },
};
