import type { Items, OrderLinesToReturn, CreateReturnsPayload, CommonReturnInfo, ItemToReturn, Option } from '~/models';
import { v4 as uuidV4 } from 'uuid';

export const changeQuantityOrderLine =
    ({ idOrderLine, value }: { idOrderLine: string; value: number }) =>
    (order: Items<OrderLinesToReturn>) => ({
        ...order,
        [idOrderLine]: {
            ...order[idOrderLine],
            quantityToReturn: value,
        },
    });

export const changeReasonOrderLine =
    ({ idOrderLine, option }: { idOrderLine: string; option: Option }) =>
    (order: Items<OrderLinesToReturn>) => ({
        ...order,
        [idOrderLine]: {
            ...order[idOrderLine],
            reason_type: option.value,
            reason: option.label,
        },
    });

export const changeQuantityItemLine =
    ({ idOrderLine, idItem, value }: { idOrderLine: string; idItem: string; value: number }) =>
    (order: Items<OrderLinesToReturn>) => {
        const currentOrderLine = order[idOrderLine];
        const currentItem = currentOrderLine.items?.find(({ id }) => id === idItem)!;
        if (!value || value - currentItem?.quantityToReturn > currentOrderLine.quantityLeft) return order;

        return {
            ...order,
            [idOrderLine]: {
                ...currentOrderLine,
                quantityLeft:
                    currentItem.quantityToReturn > value
                        ? currentOrderLine.quantityLeft + (currentItem.quantityToReturn - value)
                        : currentOrderLine.quantityLeft - (value - currentItem.quantityToReturn),
                items: [
                    ...(currentOrderLine.items?.map((item) =>
                        item.id === idItem
                            ? {
                                  ...item,
                                  quantityToReturn: value,
                              }
                            : item,
                    ) || []),
                ],
            },
        };
    };

export const changeReasonItemLine =
    ({ idOrderLine, idItem, option }: { idOrderLine: string; idItem: string; option: Option }) =>
    (order: Items<OrderLinesToReturn>) => ({
        ...order,
        [idOrderLine]: {
            ...order[idOrderLine],
            items: [
                ...(order[idOrderLine].items?.map((item) =>
                    item.id === idItem
                        ? {
                              ...item,
                              reason: option.label,
                              reason_type: option.value,
                          }
                        : item,
                ) || []),
            ],
        },
    });

export const addItemLine =
    ({ idOrderLine }: { idOrderLine: string }) =>
    (order: Items<OrderLinesToReturn>) => {
        const idItem = uuidV4();
        const orderLine = order[idOrderLine];
        return {
            ...order,
            [idOrderLine]: {
                ...orderLine,
                quantityToReturn: 0,
                quantityLeft: orderLine.quantityLeft - orderLine.quantityToReturn,
                items: [
                    ...(orderLine.items || []),
                    {
                        id: idItem,
                        reason: orderLine.reason!,
                        label: orderLine.label,
                        reason_type: orderLine.reason_type!,
                        merchant_ref: orderLine.reference,
                        order_line_id: idOrderLine,
                        quantityToReturn: orderLine.quantityToReturn,
                        isItem: true,
                    },
                ],
            },
        };
    };

export const deleteItemLine =
    ({ idOrderLine, idItem }: { idOrderLine: string; idItem: string }) =>
    (order: Items<OrderLinesToReturn>) => {
        const orderLine = order[idOrderLine];
        const { items, ...restOrderLine } = orderLine;
        const itemLine = orderLine.items?.find(({ id }) => id === idItem);
        const childrenItems = orderLine.items?.filter(({ id }) => id !== idItem) || [];
        return {
            ...order,
            [idOrderLine]: {
                ...restOrderLine,
                quantityToReturn: 0,
                quantityLeft: orderLine.quantityLeft + (itemLine?.quantityToReturn || 0),
                ...(childrenItems.length > 0 ? { items: childrenItems } : {}),
            },
        };
    };

export const mapReturns = (commonInfo: CommonReturnInfo, items: ItemToReturn[]): CreateReturnsPayload => {
    const reason = commonInfo.motives?.trim();
    return {
        ...(!!reason && { reason }),
        owner: commonInfo.entity,
        type: commonInfo.type,
        items: items.map((item) => ({
            reason: item.reason,
            label: item.label,
            reason_type: item.reason_type,
            merchant_ref: item.merchant_ref,
            order_line_id: item.order_line_id,
            quantity: item.quantityToReturn,
        })),
    };
};

export const getItems = (normalizedOrderLines: Items<OrderLinesToReturn>) =>
    Object.values(normalizedOrderLines).reduce<ItemToReturn[]>((acc, { items }) => {
        if (!items?.length) return acc;
        return [...acc, ...items];
    }, []);

export const sumItemsToReturn = (arrOrders: OrderLinesToReturn[]) =>
    arrOrders.reduce((acc, curOrder) => {
        if (!curOrder.items) return acc;
        const itemsCount = curOrder.items.reduce<number>((acc, curItem) => acc + curItem.quantityToReturn, 0);
        return acc + itemsCount;
    }, 0);
