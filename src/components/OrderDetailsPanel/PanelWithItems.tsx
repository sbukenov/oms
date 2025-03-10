import React from 'react';
import Typography from 'antd/lib/typography';
import Space from 'antd/lib/space';
import get from 'lodash/get';
import { ConfigIcon } from '@-bo/keystone-components';
import { IconNames, Color } from '@bo/component-library';

import {  } from '~/const';

import { OrderPanel, OrderPanelProps } from './Panel';
import { DetailsPanelItem } from './Panel.styled';

export type OrderPanelItem = {
    path: string;
    title: React.ReactNode;
    defaultValue?: string;
    render?: (data: any, item: any, index: number) => React.ReactNode;
    icon?: [typeof , IconNames];
};

export type OrderPanelWithItemsProps<T> = OrderPanelProps & {
    order: T;
    items: OrderPanelItem[];
    className: string;
};

export const OrderPanelWithItems = <T,>({ items, order, className, ...props }: OrderPanelWithItemsProps<T>) => {
    return (
        <OrderPanel {...props}>
            {items.map((item, index) => {
                const itemData = get(order, item.path);
                const result = item.render ? item.render(itemData, item, index) : itemData;
                return (
                    <DetailsPanelItem size="middle" align="start" key={item.path}>
                        <ConfigIcon icon={item.icon} color={Color.neutral(5)} size="md" />
                        <Space size={4} direction="vertical">
                            <Typography.Text strong type="secondary">
                                {item.title}
                            </Typography.Text>
                            <span className={`${className}${index}`}>{result ?? item.defaultValue}</span>
                        </Space>
                    </DetailsPanelItem>
                );
            })}
        </OrderPanel>
    );
};
