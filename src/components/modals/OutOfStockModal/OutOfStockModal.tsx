import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'antd/lib/modal';
import Typography from 'antd/lib/typography';

import { useActions } from '~/hooks';
import type { FulfillmentItem } from '~/models';
import { fulfillmentsActions } from '~/redux/slices';
import { calculatePicked } from '~/utils/helpers';

import { StyledNumberInput, StyledModalBody } from './OutOfStockModal.styled';

interface OutOfStockModalProps {
    item: FulfillmentItem;
    close: () => void;
}

export const OutOfStockModal: FC<OutOfStockModalProps> = ({ item, close }) => {
    const pickedItemQuantity = calculatePicked(item);
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(pickedItemQuantity);
    const { addOutOfStock } = useActions(fulfillmentsActions);

    const handleInputChange = useCallback(
        (value: React.ReactText) => {
            setQuantity(Number(value));
        },
        [setQuantity],
    );

    const onOk = useCallback(() => {
        if (!pickedItemQuantity) return;
        close();
        if (quantity && quantity <= pickedItemQuantity && quantity > 0) {
            addOutOfStock({ item, quantityOutOfStock: quantity });
            return;
        }
        addOutOfStock({ item, quantityOutOfStock: pickedItemQuantity });
    }, [close, item, quantity, addOutOfStock, pickedItemQuantity]);

    if (!pickedItemQuantity) return null;

    return (
        <Modal
            visible
            title={t('modals.out_of_stock.title')}
            okText={t('common.validate')}
            cancelText={t('common.cancel')}
            onOk={onOk}
            onCancel={close}
            cancelButtonProps={{ type: 'link' }}
        >
            <StyledModalBody>
                <Typography.Text>{t('modals.out_of_stock.content')}</Typography.Text>
                <StyledNumberInput min={1} max={pickedItemQuantity} value={quantity} onChange={handleInputChange} />
            </StyledModalBody>
        </Modal>
    );
};
