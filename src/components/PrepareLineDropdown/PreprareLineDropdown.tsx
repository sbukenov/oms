import React, { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Color, Icon } from '@bo/component-library';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import Button from 'antd/lib/button';

import { PrepareLineOptions } from '~/const';
import type { FulfillmentItem } from '~/models';
import { useActions } from '~/hooks';
import { fulfillmentsActions } from '~/redux/slices';
import { calculatePicked } from '~/utils/helpers';

import { OutOfStockModal } from '../modals';
import { MenuStyled } from './PreprareLineDropdown.styled';

interface PrepareLineDropdownProps {
    item: FulfillmentItem;
}

export const PrepareLineDropdown: FC<PrepareLineDropdownProps> = ({ item }) => {
    const { t } = useTranslation();
    const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);

    const { cancelOutOfStockAction } = useActions(fulfillmentsActions);

    const closeOutOfStockModal = useCallback(() => {
        setShowOutOfStockModal(false);
    }, []);

    const cancelOutOfStock = useCallback(() => {
        cancelOutOfStockAction({ item });
    }, [item, cancelOutOfStockAction]);

    const pickedItemQuantity = calculatePicked(item);

    if (showOutOfStockModal) {
        return <OutOfStockModal item={item} close={closeOutOfStockModal} />;
    }

    if (!pickedItemQuantity && !item.fulfilled_items_quantities.OUT_OF_STOCK) {
        return null;
    }

    const handleMenuClick = (event: MenuInfo) => {
        switch (event.key) {
            case PrepareLineOptions.OutOfStock:
                setShowOutOfStockModal(true);
                break;
            case PrepareLineOptions.CancelOutOfStock:
                Alert.confirm({
                    title: t('modals.cancel_out_of_stock.title'),
                    content: t('modals.cancel_out_of_stock.content'),
                    okText: t('common.confirm'),
                    cancelText: t('common.cancel'),
                    onOk: cancelOutOfStock,
                });
                break;
            default:
                break;
        }
    };

    const menu = (
        <MenuStyled onClick={handleMenuClick}>
            {!!pickedItemQuantity && (
                <Menu.Item key={PrepareLineOptions.OutOfStock}>
                    <Icon name="out-of-stock" size="sm" />
                    {t('fulfillment_preparation.out_of_stock')}
                </Menu.Item>
            )}
            {!!item.fulfilled_items_quantities.OUT_OF_STOCK && (
                <Menu.Item key={PrepareLineOptions.CancelOutOfStock}>
                    <Icon name="cross-circle" size="sm" />
                    {t('fulfillment_preparation.cancel_out_of_stock')}
                </Menu.Item>
            )}
        </MenuStyled>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Button type="text" shape="circle" icon={<Icon name="dots-horizontal" color={Color.secondary(6)} />} />
        </Dropdown>
    );
};
