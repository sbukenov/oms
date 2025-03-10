import dayjs, { Dayjs } from 'dayjs';
import { DEFAULT_CURRENCY, getRawAmountValue, calculateValueAndPrecision, getPrice } from '@-bo/utils';
import { FilterConfig, Filters, FilterTypes } from '@-bo/keystone-components';

import type {
    FulfillmentItem,
    OrderHistoryEvent,
    Transition,
    OrderLineSave,
    OrderSaveBody,
    Product,
    OrderLine,
    Packaging,
    LogisticUnitsBulkCreationData,
    OrderLinesQuantitiesById,
    ReceptionQuantitiesById,
    LogisticUnit,
    LogisticUnitPackagingItem,
    UnexpectedLogisticUnit,
} from '~/models';
import { PickingStatusCodes, HistoryEventIdTypes } from '~/models';
import { DAY_FORMAT, ENTITY_MOCK, REPLENISHMENT, REQUEST_DATE_FORMAT, UNEXPECTED_TYPE } from '~/const';

import { calculatePicked, formatDateRange, getValueAndPrecisionFromNumber } from './helpers';
import { getPricesAndAmounts } from './helperOrderCreation';
import { GetStatusesResponse, StatusGroups } from '../models';

export const mapFiltersForRequest = (
    filters: Record<string, any>,
    filterConfigByGroup?: FilterConfig<StatusGroups, GetStatusesResponse>,
) => {
    if (!filterConfigByGroup) return {};
    const filterConfig = Object.values(filterConfigByGroup.filterGroups).flat();
    return Object.entries(filters).reduce((acc: Record<string, unknown>, [key, value]) => {
        if (!value) return acc;
        const type = getFilterTypeByKey(key, filterConfig);
        if (!type) return acc;
        if (type === FilterTypes.rangePicker) {
            const [from, to] = mapDateRangeKeys(key);
            const dateRange = formatDateRange(value);
            acc[from] = dateRange[0];
            acc[to] = dateRange[1];

            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});
};

export const dateKeys: Record<string, [string, string]> = {
    created_at: ['created_at[from]', 'created_at[to]'],
};

export const mapDateRangeKeys = (key: string) => [`${key}[from]`, `${key}[to]`];

export const getFilterTypeByKey = (filterKey: string, filterConfig: Filters<StatusGroups, GetStatusesResponse>[]) =>
    filterConfig.find(({ key }) => key === filterKey)?.type;

export const mapFilters = (filters: Record<string, any>) => {
    return Object.entries(filters).reduce((acc: Record<string, unknown>, [key, value]) => {
        if (!value) return acc;

        if (dateKeys[key]) {
            const [from, to] = dateKeys[key];
            const dateRange = formatDateRange(value);
            acc[from] = dateRange[0];
            acc[to] = dateRange[1];

            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});
};

export const mapFulfillmentItemsToTransit = (fulfillmentItems: FulfillmentItem[], transition: Transition) =>
    fulfillmentItems.map((fulfillmentItem) => ({ transition, fulfillment_item_id: fulfillmentItem.id }));

export const mapFulfilledItemsToComplete = (fulfillmentItem: FulfillmentItem) => {
    let fulfilledItems = [];

    if (!!fulfillmentItem.fulfilled_items_quantities.OUT_OF_STOCK) {
        fulfilledItems.push({
            quantity: fulfillmentItem.fulfilled_items_quantities.OUT_OF_STOCK,
            picking_status: PickingStatusCodes.OUT_OF_STOCK,
        });
    }

    if (!!calculatePicked(fulfillmentItem)) {
        fulfilledItems.push({
            quantity: calculatePicked(fulfillmentItem),
            picking_status: PickingStatusCodes.PICKED,
        });
    }

    return fulfilledItems;
};

export const mapFulfillmentItemsToComplete = (fulfillmentItems: FulfillmentItem[]) => ({
    fulfillment_items: fulfillmentItems.map((fulfillmentItem) => ({
        fulfillment_item_id: fulfillmentItem.id,
        fulfilled_items: mapFulfilledItemsToComplete(fulfillmentItem),
    })),
});

const HANDLED_HISTORY_EVENTS: Record<HistoryEventIdTypes, boolean> = {
    [HistoryEventIdTypes.OrderStatusChanged]: true,
    [HistoryEventIdTypes.OrderFulfillmentStatusChanged]: true,
    [HistoryEventIdTypes.OrderShipmentStatusChanged]: true,
    [HistoryEventIdTypes.OrderCancelled]: true,
    [HistoryEventIdTypes.OrderCommentCreated]: true,
    [HistoryEventIdTypes.OrderCommentUpdated]: true,
    [HistoryEventIdTypes.OrderCommentDeleted]: true,
    [HistoryEventIdTypes.FulfillmentCreated]: true,
    [HistoryEventIdTypes.FulfillmentStatusChanged]: true,
    [HistoryEventIdTypes.FulfillmentCancelled]: true,
    [HistoryEventIdTypes.ShipmentCreated]: true,
    [HistoryEventIdTypes.ShipmentStatusChanged]: true,
    [HistoryEventIdTypes.ShipmentCancelled]: true,
    [HistoryEventIdTypes.OrderShippingAddressUpdated]: true,
    [HistoryEventIdTypes.OrderReturnCreated]: true,
    [HistoryEventIdTypes.OrderReturnStatusChanged]: true,
    [HistoryEventIdTypes.OrderReturnCancelled]: true,
    [HistoryEventIdTypes.OrderBillingAddressUpdated]: true,
    [HistoryEventIdTypes.OrderLineUpdated]: true,
    [HistoryEventIdTypes.TransactionCreated]: true,
    [HistoryEventIdTypes.TransactionStatusChanged]: true,
    [HistoryEventIdTypes.TransactionCancelled]: true,
    [HistoryEventIdTypes.ExpeditionCreated]: true,
    [HistoryEventIdTypes.ReceptionCreated]: true,
};

export const mapHistoryByDay = (events: OrderHistoryEvent[] | undefined) => {
    if (!events) return [];

    return events
        .filter((event) => !!HANDLED_HISTORY_EVENTS[event.event_id])
        .reduce((acc: { data: OrderHistoryEvent[]; date: string }[], item) => {
            const last_added_day = acc[acc.length - 1];

            if (!last_added_day) {
                acc.push({ data: [item], date: item.created_at });
                return acc;
            }

            if (dayjs(item.created_at).isSame(last_added_day.date, 'day')) {
                last_added_day.data.push(item);
                return acc;
            }

            acc.push({ data: [item], date: item.created_at });
            return acc;
        }, []);
};

export const stripEmptyValues = <T extends Record<string, any>>(data: T) => {
    for (const key in data) {
        if (data[key] === '') {
            delete data[key];
        }
    }

    return data;
};

export const isFee = (data: Record<string, any>): boolean => {
    return !!data.line && 'isFee' in data.line && data.line.isFee === true;
};

export const printDays = (data?: number[]): string | undefined => {
    if (!data?.length) return;
    return data.map((weekNumber) => dayjs().isoWeekday(weekNumber).format(DAY_FORMAT)).join(', ');
};

export const mapOrderLines = (products: Product[]): OrderLineSave[] =>
    products.map(
        ({
            selectedPackaging,
            quantity,
            amount_excluding_vat,
            amount_including_vat,
            unit_price_excluding_vat,
            unit_price_including_vat,
            vat_amount,
        }) => ({
            label: selectedPackaging?.label,
            product_pim_uuid: selectedPackaging?.pim_uuid,
            type: 'packaging_item',
            reference: selectedPackaging?.reference,
            unit_vat_amount: calculateValueAndPrecision(
                (
                    getPrice(selectedPackaging?.price?.amount) *
                    (getPrice(selectedPackaging?.price?.vat_rate) / 100)
                ).toFixed(2),
            ),
            quantity,
            amount_excluding_vat,
            amount_including_vat,
            unit_price_excluding_vat,
            unit_price_including_vat,
            vat_amount,
            vat_rate: selectedPackaging?.price?.vat_rate,
            packaging: selectedPackaging?.id,
        }),
    );

export const mapDraftOrder = (
    supplierUuid: string,
    deliveryDate: Dayjs,
    products: Product[],
    entity = ENTITY_MOCK,
): OrderSaveBody => ({
    type: REPLENISHMENT,
    currency: entity?.currency?.iso_code || DEFAULT_CURRENCY,
    owner: supplierUuid,
    promised_delivery_date: deliveryDate.format(REQUEST_DATE_FORMAT),
    reference: `Order ${dayjs().format('DMMYYHmmss')}`,
    order_lines: mapOrderLines(products),
    shipping_address: {
        name: entity.label,
        line_1: entity.entity_address?.address_inline,
        line_2: entity.entity_address?.complement,
        line_3: null,
        postal_code: entity.entity_address?.postal_code,
        country_code: 'FRA',
        city: entity.entity_address?.city,
        email: entity.entity_address?.mail,
        phone: entity.entity_address?.telephone,
        comment: null,
        type: 'Personal',
    },
    billing_address: {
        name: entity.label,
        line_1: entity.entity_address?.address_inline,
        line_2: entity.entity_address?.complement,
        line_3: null,
        postal_code: entity.entity_address?.postal_code,
        country_code: 'FRA',
        city: entity.entity_address?.city,
        email: entity.entity_address?.mail,
        phone: entity.entity_address?.telephone,
        comment: null,
        type: 'Personal',
    },
    customer: {
        reference: null,
        name: entity.label,
        type: 'business',
        account_id: entity.uuid,
        email: entity.entity_address?.mail,
        phone_number: entity.entity_address?.telephone,
    },
});

export const mapOrderLinesToProducts = (packagings: Packaging[], orderLines: OrderLine[]) => {
    return packagings.reduce((acc: any, data, index) => {
        const key = data.packaging_product?.pim_uuid + data.id;

        acc[key] = {
            product: data.packaging_product,
            selectedPackaging: {
                id: data.id,
                price: data.price,
                label: data.label,
                reference: data.reference,
                product_per_packaging: data.product_per_packaging,
                packaging_per_pallet: data.packaging_per_pallet,
                owner: data.owner,
                min_quantity: data.min_quantity,
            },
            ...getPricesAndAmounts(orderLines[index].quantity, data.price),
        };
        return acc;
    }, {});
};

export const mapLogisticUnitsData = (
    expeditionId: string | undefined,
    selectedProductsById: OrderLinesQuantitiesById,
): LogisticUnitsBulkCreationData => {
    if (!expeditionId) {
        throw Error('No expeditions');
    }
    return {
        replenishment_operation: expeditionId,
        logistic_units: Object.values(selectedProductsById).map(({ price, type, quantity, packaging }) => ({
            type: 'integrated',
            price: calculateValueAndPrecision(String(price)),
            packaging: {
                id: packaging.id,
                quantity: type === UNEXPECTED_TYPE ? 0 : quantity,
                items: [
                    {
                        quantity: quantity,
                        barcode: packaging.product.barcode,
                    },
                ],
            },
            logistic_unit_items: [
                {
                    barcode: packaging.product.barcode,
                    label: packaging.product.label,
                    pim_uuid: packaging.product.pim_uuid,
                    image_url: packaging.product.image_url,
                    quantity: packaging.product_per_packaging,
                },
            ],
        })),
    };
};

export const mapLogisticUnitsForReception = (
    receptionId: string | undefined,
    quantities: ReceptionQuantitiesById,
): LogisticUnitsBulkCreationData => {
    if (!receptionId) {
        throw Error('No reception');
    }
    return {
        replenishment_operation: receptionId,
        logistic_units: Object.values(quantities).map((value) => {
            return {
                type: 'integrated',
                price: typeof value.price === 'number' ? getValueAndPrecisionFromNumber(value.price) : value.price,
                packaging: {
                    id: value.packaging.id,
                    quantity:
                        value.type === UNEXPECTED_TYPE
                            ? 0
                            : value.packaging.quantity || value.received + value.damaged + value.missing,
                    barcode: value.packaging.barcode,
                    items: [
                        {
                            quantity: value.packaging.quantity || value.received + value.damaged + value.missing,
                            barcode: value.packaging.items[0].barcode,
                            reception_state: {
                                RECEIVED: value.received,
                                DAMAGED: value.damaged,
                                DID_NOT_RECEIVE: value.missing,
                            },
                        },
                    ],
                },
                logistic_unit_items: [
                    {
                        barcode: value.logistic_unit_items[0].barcode,
                        reference: value.logistic_unit_items[0].reference,
                        label: value.logistic_unit_items[0].label,
                        pim_uuid: value.logistic_unit_items[0].pim_uuid,
                        image_url: value.logistic_unit_items[0].image_url,
                        quantity: value.logistic_unit_items[0].quantity,
                        batch_number: value.logistic_unit_items[0].batch_number,
                        minimum_durability_date: value.logistic_unit_items[0].minimum_durability_date,
                        expiry_date: value.logistic_unit_items[0].expiry_date,
                    },
                ],
            };
        }),
    };
};

export const mapProductToLogisticUnit = (products: Product[]): UnexpectedLogisticUnit[] => {
    return products.map(({ product, selectedPackaging }) => ({
        id: `${product.pim_uuid}${selectedPackaging?.id}`,
        isUnexpected: true,
        type: UNEXPECTED_TYPE,
        barcode: null,
        reference: null,
        status: null,
        supplier_reference: null,
        price: getRawAmountValue(selectedPackaging?.price?.amount),
        url: '',
        logistic_unit_items: [
            {
                label: product.label,
                barcode: product.barcode,
                quantity: selectedPackaging?.product_per_packaging,
                image_url: product.image_url,
                pim_uuid: product.pim_uuid,
            },
        ] as LogisticUnit['logistic_unit_items'],
        packaging: {
            id: selectedPackaging?.id || '',
            reference: selectedPackaging?.reference || '',
            label: selectedPackaging?.label || '',
            quantity: undefined as any,
            items: [
                {
                    barcode: product.barcode,
                    quantity: 0,
                    reception_state: {} as LogisticUnitPackagingItem['reception_state'],
                },
            ],
            barcode: null,
        },
    }));
};
