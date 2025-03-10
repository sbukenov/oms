import type { Route } from '@types/bo-module-aggregator';

import * as Routes from './routes';

export const NAVIGATION: Route = {
    route_label: 'navigation.orders',
    route_name: 'orders-v2',
    icon: 'view-grid',
    entities: [],
    subroutes: [
        {
            route_label: 'navigation.my_orders',
            route_name: Routes.ROUTE_OMS_ORDERS,
            icon: undefined,
            privilege: 'oms-v2.order.list',
            entities: [{ type: 'Commandes' }],
        },
        {
            route_label: 'navigation.my_preparations',
            route_name: Routes.ROUTE_OMS_FULFILLMENTS,
            icon: undefined,
            privilege: 'oms-v2.fulfillment.list-all',
            entities: [{ type: 'Commandes' }],
        },
        {
            route_label: 'navigation.my_deliveries',
            route_name: Routes.ROUTE_OMS_DELIVERIES,
            icon: undefined,
            privilege: 'oms-v2.shipment.list-all',
            entities: [{ type: 'Commandes' }],
        },
        {
            route_label: 'navigation.my_returns',
            route_name: Routes.ROUTE_OMS_RETURNS,
            icon: undefined,
            privilege: 'oms-v2.return.list-all',
            entities: [{ type: 'Commandes' }],
        },
        {
            route_label: 'navigation.my_transactions',
            route_name: Routes.ROUTE_OMS_TRANSACTIONS,
            icon: undefined,
            privilege: 'oms-v2.transaction.list-all',
            entities: [{ type: 'Commandes' }],
        },
    ],
};
