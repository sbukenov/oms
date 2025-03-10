import type { InitAccessors } from '@types/bo-module-aggregator';
import { Client, EntityAccessor } from '@sdk-api';
import { BusinessUnitsAccessor } from '@bo/utils';
import dayjs from 'dayjs';

import {
    OrdersAccessor,
    FulfillmentsAccessor,
    ReturnsAccessor,
    ShipmentsAccessor,
    TransactionsAccessor,
    MetaAccessor,
    PackagingAccessor,
    ReplenishmentConditionsAccessor,
    StockOperationAccessor,
    HistoryAccessor,
} from '~/accessors';

import i18n from './i18n';

let entityAccessor: EntityAccessor;
let ordersAccessor: OrdersAccessor;
let fulfillmentsAccessor: FulfillmentsAccessor;
let businessUnitsAccessor: BusinessUnitsAccessor;
let returnsAccessor: ReturnsAccessor;
let shipmentsAccessor: ShipmentsAccessor;
let transactionsAccessor: TransactionsAccessor;
let metaAccessor: MetaAccessor;
let packagingAccessor: PackagingAccessor;
let replenishmentConditionsAccessor: ReplenishmentConditionsAccessor;
let stockOperationAccessor: StockOperationAccessor;
let historyAccessor: HistoryAccessor;

export const initAccessors: InitAccessors = ({ apiUrl, token }) => {
    const client = new Client({
        url: apiUrl,
        token: token || undefined,
        cachePolicy: false,
    });

    client.register();

    // @ts-ignore
    client.axios?.interceptors?.request?.use((config) => {
        client.addHeaders({ 'Accept-Language': i18n.resolvedLanguage, timezone: dayjs.tz.guess() });
        return config;
    });

    ordersAccessor = new OrdersAccessor();
    fulfillmentsAccessor = new FulfillmentsAccessor();
    businessUnitsAccessor = new BusinessUnitsAccessor();
    returnsAccessor = new ReturnsAccessor();
    shipmentsAccessor = new ShipmentsAccessor();
    transactionsAccessor = new TransactionsAccessor();
    metaAccessor = new MetaAccessor();
    packagingAccessor = new PackagingAccessor();
    replenishmentConditionsAccessor = new ReplenishmentConditionsAccessor();
    stockOperationAccessor = new StockOperationAccessor();
    historyAccessor = new HistoryAccessor();
};

export const initMonolithAccessors: InitAccessors = ({ apiUrl, token }) => {
    const client = new Client({
        url: apiUrl,
        token: token || undefined,
        cachePolicy: false,
    });

    client.register();

    // @ts-ignore
    client.axios?.interceptors?.request?.use((config) => {
        client.addHeaders({ 'Accept-Language': i18n.resolvedLanguage, timezone: dayjs.tz.guess() });
        return config;
    });

    entityAccessor = new EntityAccessor();
};

export {
    entityAccessor,
    ordersAccessor,
    fulfillmentsAccessor,
    businessUnitsAccessor,
    returnsAccessor,
    shipmentsAccessor,
    transactionsAccessor,
    metaAccessor,
    packagingAccessor,
    replenishmentConditionsAccessor,
    stockOperationAccessor,
    historyAccessor,
};
