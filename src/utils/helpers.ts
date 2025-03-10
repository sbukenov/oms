import React from 'react';
import { NavigateFunction } from 'react-router';
import { Rule, RuleObject } from 'antd/lib/form';
import type { TFunction } from 'i18next';
import dayjs, { Dayjs } from 'dayjs';
import isNil from 'lodash/isNil';
import { AvailableLanguages } from '@-types/bo-module-aggregator';
import {
    preventEmptySpaces,
    getFirstAvailable,
    showErrorNotification,
    getRawAmountValue,
    Entity,
    getSelectedEntity,
    MAIN_ENTITY_ID,
} from '@-bo/utils';
import { v4 } from 'uuid';

import { REQUEST_DATE_FORMAT, DEFAULT_DASH, TIME_WITH_TIMEZONE_FORMAT } from '~/const';
import type {
    SupplierConditions,
    FulfillmentItem,
    Fulfillment,
    StatusOption,
    StatusesByStatusGroup,
    HistoryEventHandlersMap,
    OrderHistoryEvent,
    OrderLine,
    ShipmentItemShort,
    History,
    Product,
    Items,
    Packaging,
    ReceptionQuantitiesById,
} from '~/models';
import { FulfillmentStatusCodes, HistoryEventIdTypes } from '~/models';
import i18n from '~/utils/i18n';
import {
    PRIVILEGE_ORDER_DETAILS,
    PRIVILEGE_SYNTHESIS_TAB,
    PRIVILEGE_PREPARATION_TAB,
    PRIVILEGE_DELIVERY_TAB,
    PRIVILEGE_RETURN_TAB,
    PRIVILEGE_TRANSACTION_TAB,
    ROUTE_ORDER,
    ROUTE_PREPARATION,
    ROUTE_DELIVERY,
    ROUTE_RETURN,
    ROUTE_TRANSACTION,
    ROUTE_NO_ACCESS,
} from '~/const';
import { getPricesAndAmounts } from './helperOrderCreation';

export const formatDateRange = (dateRange?: [string, string] | null, format = REQUEST_DATE_FORMAT) => {
    return dateRange
        ? [dayjs(dateRange[0]).startOf('day').format(format), dayjs(dateRange[1]).endOf('day').format(format)]
        : [undefined, undefined];
};

export const checkDateIsAfterToday = (date: Dayjs) => {
    return date.isAfter(undefined, 'day');
};

export const isNotEmptyValue = (value: any) => {
    if (isNil(value)) return false;

    return Array.isArray(value) && value.length > 0;
};

export const mapFulfillmentItems = (fulfillmentItems: FulfillmentItem[] = []) =>
    fulfillmentItems.reduce<FulfillmentItem[]>((acc, fulfillmentItem) => {
        acc.push(fulfillmentItem);

        const fulfilledItems = fulfillmentItem.fulfilled_items;
        if (!fulfilledItems || !fulfilledItems.length) return acc;

        const substituteItems = fulfilledItems
            .filter((substituteItem) => substituteItem.picking_status === 'SUBSTITUTE')
            .map<FulfillmentItem>((substituteItem) => ({
                ...fulfillmentItem,
                ...substituteItem,
                isSubstitute: true,
                fulfilled_items_quantities: { PICKED: substituteItem.quantity.quantity },
            }));
        return acc.concat(substituteItems);
    }, []);

export const isFulfillmentReadyForPreparation = (data: Fulfillment | undefined) =>
    !!data?.status &&
    [
        FulfillmentStatusCodes.TO_PREPARE,
        FulfillmentStatusCodes.PREPARING,
        FulfillmentStatusCodes.PARTIALLY_PICKED,
    ].includes(data.status);

export const calculatePicked = (fulfillmentItem: FulfillmentItem) => {
    if (fulfillmentItem.fulfilled_items_quantities.PICKED !== undefined) {
        return fulfillmentItem.fulfilled_items_quantities.PICKED;
    }

    if (fulfillmentItem.fulfilled_items_quantities.OUT_OF_STOCK) {
        return fulfillmentItem.quantity.quantity - fulfillmentItem.fulfilled_items_quantities.OUT_OF_STOCK;
    }

    return fulfillmentItem.quantity.quantity;
};

const handleChangeWithUser = (event: OrderHistoryEvent, translation: string) => {
    const { user } = event;
    const eventUser = user ? i18n.t('common.by_someone', { firstName: user.first_name, lastName: user.last_name }) : '';

    return `${i18n.t(translation)}${eventUser}`;
};

const eventHandlersMap: {
    [K in keyof HistoryEventHandlersMap]: (
        event: HistoryEventHandlersMap[K],
        statuses: StatusesByStatusGroup,
        language: AvailableLanguages,
    ) => string;
} = {
    [HistoryEventIdTypes.OrderShipmentStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.orderShipment && statuses.orderShipment[before]?.title[language];
        const new_status = statuses.orderShipment && statuses.orderShipment[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.order_shipment_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.OrderFulfillmentStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.orderFulfillment && statuses.orderFulfillment[before]?.title[language];
        const new_status = statuses.orderFulfillment && statuses.orderFulfillment[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.preparation_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.OrderStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.order && statuses.order[before]?.title[language];
        const new_status = statuses.order && statuses.order[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.order_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.FulfillmentStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.fulfillment && statuses.fulfillment[before]?.title[language];
        const new_status = statuses.fulfillment && statuses.fulfillment[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.fulfillment_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.ShipmentStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.shipment && statuses.shipment[before]?.title[language];
        const new_status = statuses.shipment && statuses.shipment[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.shipment_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.OrderReturnStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.return && statuses.return[before]?.title[language];
        const new_status = statuses.return && statuses.return[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.return_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.OrderCancelled]: (event) => handleChangeWithUser(event, 'order.history.order_cancelled'),
    [HistoryEventIdTypes.OrderCommentCreated]: (event) =>
        handleChangeWithUser(event, 'order.history.order_comment_created'),
    [HistoryEventIdTypes.OrderCommentUpdated]: (event) =>
        handleChangeWithUser(event, 'order.history.order_comment_updated'),
    [HistoryEventIdTypes.OrderCommentDeleted]: (event) =>
        handleChangeWithUser(event, 'order.history.order_comment_deleted'),
    [HistoryEventIdTypes.FulfillmentCreated]: (event) =>
        handleChangeWithUser(event, 'order.history.fulfillment_created'),
    [HistoryEventIdTypes.ShipmentCreated]: (event) => handleChangeWithUser(event, 'order.history.shipment_created'),
    [HistoryEventIdTypes.FulfillmentCancelled]: (event) =>
        handleChangeWithUser(event, 'order.history.fulfillment_cancelled'),
    [HistoryEventIdTypes.ShipmentCancelled]: (event) => handleChangeWithUser(event, 'order.history.shipment_cancelled'),
    [HistoryEventIdTypes.OrderShippingAddressUpdated]: (event) =>
        handleChangeWithUser(event, 'order.history.shipping_address_changed'),
    [HistoryEventIdTypes.OrderReturnCreated]: (event) => handleChangeWithUser(event, 'order.history.return_created'),
    [HistoryEventIdTypes.OrderReturnCancelled]: (event) =>
        handleChangeWithUser(event, 'order.history.return_cancelled'),
    [HistoryEventIdTypes.OrderBillingAddressUpdated]: (event) =>
        handleChangeWithUser(event, 'order.history.billing_address_changed'),
    [HistoryEventIdTypes.OrderLineUpdated]: (event) => handleChangeWithUser(event, 'order.history.order_line_updated'),
    [HistoryEventIdTypes.TransactionCreated]: (event) =>
        handleChangeWithUser(event, 'order.history.transaction_created'),
    [HistoryEventIdTypes.TransactionStatusChanged]: (event, statuses, language) => {
        const { before, after } = event.state.status;
        const old_status = statuses.return && statuses.transaction[before]?.title[language];
        const new_status = statuses.return && statuses.transaction[after]?.title[language];
        const user = event.user
            ? i18n.t('common.by_someone', { firstName: event.user.first_name, lastName: event.user.last_name })
            : '';

        return `${i18n.t('order.history.transaction_status_changed', { from: old_status, to: new_status })}${user}`;
    },
    [HistoryEventIdTypes.TransactionCancelled]: (event) =>
        handleChangeWithUser(event, 'order.history.transaction_cancelled'),
    [HistoryEventIdTypes.ExpeditionCreated]: (event) => handleChangeWithUser(event, 'order.history.expedition_created'),
    [HistoryEventIdTypes.ReceptionCreated]: (event) => handleChangeWithUser(event, 'order.history.reception_created'),
};

export const createChangeLogText = <K extends keyof HistoryEventHandlersMap>(
    event: HistoryEventHandlersMap[K],
    statuses: StatusesByStatusGroup | undefined,
) => {
    if (!statuses) {
        throw new Error('Statuses must be defined');
    }

    const language = i18n.resolvedLanguage as AvailableLanguages;
    const event_id: K = event.event_id;

    return eventHandlersMap[event_id](event, statuses, language);
};

export const showReference = (reference?: string | null) => (reference ? `# ${reference}` : DEFAULT_DASH);

export const filterInputByOption = (input: string, option?: StatusOption) => {
    return !!option?.title.toLocaleLowerCase().includes(input.toLocaleLowerCase());
};

export const isValidToReturn = ({ delivery_items_quantities: qty, type }: OrderLine) =>
    qty?.left_for_return > 0 && type === 'item_line';

export const convertMBtoB = (value: number) => value * Math.pow(1024, 2);

export const convertBtoMB = (value: number, decimals = 2) => {
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(value) / Math.log(k));

    return parseFloat((value / Math.pow(k, i)).toFixed(dm));
};

export const getValueAndPrecisionFromNumber = (value?: number) => {
    if (!value) return { value: 0, precision: 0 };
    return calculateValueAndPrecision(value.toFixed(2));
};

export const calculateValueAndPrecision = (value: string) => {
    if (isNaN(Number(value))) {
        throw new Error('can not convert value to a number');
    }

    const valueAsInt = Number(value.replace('.', ''));
    const [, charsAfterDot] = value.split('.');

    return { value: valueAsInt, precision: charsAfterDot?.length || 0 };
};

export const filerShortShipmentItems = (value: ShipmentItemShort | null): value is ShipmentItemShort => !!value;

export const normalizeCountryCode = (value: string, prevValue: string) => {
    return preventEmptySpaces(value, prevValue).toUpperCase();
};

export const countActiveFilters = (filters: Record<string, unknown>) =>
    Object.values(filters).filter(isNotEmptyValue).length;

export const hasNextHistoryPage = (pagination: History['pagination']) => {
    if (!pagination) return false;
    const { page, max_items, total } = pagination;
    return page < Math.ceil(total / max_items);
};

export const searchByMask = (string: string, mask: RegExp) => {
    const matchesUTF8 = mask.exec(string);
    if (matchesUTF8 != null && matchesUTF8[1]) {
        return decodeURI(matchesUTF8[1].replace(/['"]/g, ''));
    }
};

export const getAmoundValidationRules = (t: TFunction): Rule[] => [
    { required: true },
    { type: 'number' },
    () => ({
        validator(_: RuleObject, value: any) {
            if (value >= 0) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(t('errors.positive_number')));
        },
    }),
];

export const redirectToFirstAvailableTab = ({
    id,
    t,
    baseRoute,
    navigate,
    privileges,
}: {
    id: string;
    baseRoute: string;
    t: TFunction;
    navigate: NavigateFunction;
    privileges: Set<string>;
}) => {
    const firstAvailableTab = getFirstAvailable(privileges, PRIVILEGE_ORDER_DETAILS);
    switch (firstAvailableTab) {
        case PRIVILEGE_SYNTHESIS_TAB:
            navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}`);
            showErrorNotification({
                message: t('common.no_access'),
                description: t('notifications.no_access_tab'),
            });
            break;
        case PRIVILEGE_PREPARATION_TAB:
            navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}/${ROUTE_PREPARATION}`);
            showErrorNotification({
                message: t('common.no_access'),
                description: t('notifications.no_access_tab'),
            });
            break;
        case PRIVILEGE_DELIVERY_TAB:
            navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}/${ROUTE_DELIVERY}`);
            showErrorNotification({
                message: t('common.no_access'),
                description: t('notifications.no_access_tab'),
            });
            break;
        case PRIVILEGE_RETURN_TAB:
            navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}/${ROUTE_RETURN}`);
            showErrorNotification({
                message: t('common.no_access'),
                description: t('notifications.no_access_tab'),
            });
            break;
        case PRIVILEGE_TRANSACTION_TAB:
            navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}/${ROUTE_TRANSACTION}`);
            showErrorNotification({
                message: t('common.no_access'),
                description: t('notifications.no_access_tab'),
            });
            break;
        case undefined:
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            break;
        default:
            break;
    }
};

export const makeUniqueByUuid = (products: Product[], byUuid: Items<Product>) =>
    products.reduce((acc, product: Product) => {
        const uuid = product.product.pim_uuid;
        return !uuid || acc[uuid] ? acc : { ...acc, [uuid]: product };
    }, byUuid);

export const getUuidIdProduct = ({ product, selectedPackaging }: Product) =>
    `${product.pim_uuid}${selectedPackaging?.id}`;

export const mapProductsByUuidId = (products: Product[], byUuid: Items<Product>, allowDuplicates = false) =>
    products.reduce((acc, product: Product) => {
        const selectedPackaging = product.packagings.find(({ isChosen }) => isChosen);
        const uuid = allowDuplicates ? v4() : `${product.product.pim_uuid}${selectedPackaging?.id}`;

        return !uuid || acc[uuid]
            ? acc
            : {
                  ...acc,
                  [uuid]: {
                      ...(allowDuplicates && { auto_id: uuid }),
                      selectedPackaging,
                      ...product,
                      ...getPricesAndAmounts(selectedPackaging?.min_quantity || 1, selectedPackaging?.price),
                  },
              };
    }, byUuid);

export const applyPackagingConditions = (packagings: Packaging[]) => {
    packagings.forEach((packaging) => {
        if (Object.values(packaging.packaging_conditions).length) {
            const condition = Object.values(packaging.packaging_conditions)[0];
            packaging.price = condition.price;
            packaging.min_quantity = condition.min_quantity;
        }
    });
};

export const mapProducts = (products: Product[]) =>
    products.map((product) => {
        applyPackagingConditions(product.packagings);
        return {
            ...product,
            packagings: product.packagings.fill({ ...product.packagings[0], isChosen: true }, 0, 1),
        };
    });

export const findClosestDate = (
    currentDate: Dayjs,
    callback: (value: React.SetStateAction<Dayjs | undefined>) => void,
    availableWeekDays?: number[],
) => {
    if (!availableWeekDays?.length) {
        callback(undefined);
        return;
    }
    for (let i = 0; i < 7; i++) {
        const day = currentDate.add(i, 'day');
        if (availableWeekDays.includes(day.isoWeekday())) {
            callback(day);
            break;
        }
    }
};

export const getDeliveryDate = (orderDate: Dayjs, conditions: SupplierConditions) => {
    if (!conditions?.delivery_delay) {
        return orderDate;
    }
    return orderDate.add(conditions.delivery_delay, 'day');
};

export const getOrderDate = (deadline?: string) => {
    let orderDate = dayjs();
    if (!deadline) return orderDate;

    const formattedDeadline = dayjs(deadline, TIME_WITH_TIMEZONE_FORMAT);
    if (orderDate.isAfter(formattedDeadline)) {
        orderDate = orderDate.add(1, 'day');
    }
    return orderDate;
};

export const getProductPrice = (price: Packaging['price'], quantity = 1): number => {
    if (!price?.amount) return 0;
    if (!price.grids.length) return getRawAmountValue(price.amount);

    const gridPrice = price.grids.find((grid) => {
        const min = getRawAmountValue(grid.min);
        const max = grid.max ? getRawAmountValue(grid.max) : Infinity;

        return quantity >= min && quantity <= max;
    });

    return getRawAmountValue(gridPrice?.amount || price.amount);
};

export const getReplenishmentTotals = (products: Product[]) => {
    let totalExclVat = 0;
    let totalVat = 0;
    let totalInclVat = 0;

    products.forEach((item) => {
        if (!item.selectedPackaging?.price || !item.quantity) return;
        const price = getProductPrice(item.selectedPackaging?.price, item.quantity);
        const vat = getRawAmountValue(item.selectedPackaging.price.vat_rate);

        totalExclVat += price * item.quantity;
        totalVat += (price / 100) * vat * item.quantity;
        totalInclVat += ((price / 100) * vat + price) * item.quantity;
    });

    return {
        totalExclVat,
        totalVat,
        totalInclVat,
    };
};

export const handleEntityParam = (isSelectedEntityIncluded: boolean, route?: string) => {
    const entity: Entity | null = getSelectedEntity();
    let entityKey = 'owner';

    if (route?.includes('/orders?type[]=replenishment')) {
        entityKey = 'customer[account_id]';
    }
    if (route?.includes('shipments')) {
        entityKey = 'issuer';
    }

    return {
        ...(isSelectedEntityIncluded && !!entity && entity?.id !== MAIN_ENTITY_ID && { [entityKey]: [entity.uuid] }),
    };
};

export const getReceptionMax = (
    quantities: ReceptionQuantitiesById[string],
    initialQuantity: number,
    excludeKey: keyof Omit<ReceptionQuantitiesById[string], 'packaging'>,
) => {
    if (!initialQuantity) return undefined;
    return Object.entries(quantities).reduce((acc, [key, value]) => {
        if (typeof value !== 'number') return acc;
        if (key === excludeKey) return acc;
        return acc - value;
    }, initialQuantity);
};

export const getShipmentItemQuantity = (orderLines: OrderLine[] | undefined, fulfillmentItem: FulfillmentItem) => {
    const leftForShip =
        orderLines?.find((line) => {
            return line.id === fulfillmentItem.order_line.id;
        })?.delivery_items_quantities.left_for_ship ?? 0;
    const picked = fulfillmentItem?.fulfilled_items_quantities?.PICKED ?? 0;
    const substituted = fulfillmentItem?.fulfilled_items_quantities?.SUBSTITUTE ?? 0;

    if (picked + substituted < leftForShip) {
        return picked + substituted;
    }

    return leftForShip;
};
