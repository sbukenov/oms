import type { RootState } from '~/models';

export const defaultState: RootState = {
    ordersPage: {
        table: {
            data: {
                orders: [],
            },
            loading: false,
        },
        filters: {
            owner: [],
        },
        search: '',
        route: undefined,
    },
    orderDetails: {
        loading: false,
        data: undefined,
        unexpectedItemsByUuid: {},
        historyLoading: false,
        history: {
            object: undefined,
            object_events: [],
            pagination: undefined,
        },
        businessUnits: [],
        supplierLoading: false,
        supplier: undefined,
        replenishmentOperationsLoading: false,
        replenishmentOperations: [],
        addingNewDelivery: false,
    },
    fulfillments: {
        orderFulfillmentDetailed: {
            loading: false,
            data: undefined,
        },
        fulfillmentPreparation: {
            loading: false,
            data: undefined,
        },
        table: {
            fulfillments: [],
            loading: false,
            headers: {
                next: undefined,
                prev: undefined,
            },
            search: '',
            filters: {
                owner: [],
            },
            route: undefined,
        },
    },
    receptions: {
        orderReceptions: {
            loading: false,
            orderId: undefined,
            receptions: [],
        },
    },
    expeditions: {
        orderExpeditions: {
            loading: false,
            orderId: undefined,
            expeditions: [],
        },
    },
    shipments: {
        orderShipments: {
            loading: false,
            orderId: undefined,
            shipments: [],
            isApplyingTransition: false,
        },
        table: {
            loading: false,
            shipments: [],
            headers: {
                next: undefined,
                prev: undefined,
            },
            search: '',
            filters: {
                issuer: [],
            },
            route: undefined,
        },
    },
    returns: {
        orderReturns: {
            loading: false,
            orderId: undefined,
            returns: [],
        },
        reasons: [],
        table: {
            returns: [],
            loading: false,
            headers: {
                next: undefined,
                prev: undefined,
            },
            search: '',
            filters: {
                owner: [],
            },
            route: undefined,
        },
    },
    transactions: {
        orderTransactions: {
            loading: false,
            transactions: {},
            orderId: undefined,
        },
        table: {
            transactions: [],
            isApplyingAction: false,
            loading: false,
            headers: {
                next: undefined,
                prev: undefined,
            },
            search: '',
            filters: {
                owner: [],
            },
            route: undefined,
        },
    },
    statuses: null,
    types: null,
    businessUnits: [],
    config: {},
    initial: { isInitialized: false },
    orderCreation: {
        isSuppliersLoading: false,
        productsByUuid: {},
        isUpdating: false,
        suppliers: [],
    },
    products: {
        loading: true,
        products: [],
        allProductsByUuid: {},
        next: undefined,
        prev: undefined,
    },
    packagings: {
        loading: false,
        packagings: [],
    },
    receptionCreation: {
        loading: false,
        reception: undefined,
        productsByUuid: {},
    },
};
