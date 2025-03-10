import React, { FC, useCallback } from 'react';
import type { FormInstance } from 'antd';

import { StyledInputNumber } from './ShipmentCreationQuantityInput.styled';

interface ShipmentCreationQuantityInputProps {
    picked: number;
    recordId: string;
    updateQuantityToShip: () => void;
    getFieldValue: FormInstance['getFieldValue'];
    setFieldValue: FormInstance['setFieldValue'];
    max: number;
}

export const ShipmentCreationQuantityInput: FC<ShipmentCreationQuantityInputProps> = ({
    picked,
    recordId,
    updateQuantityToShip,
    getFieldValue,
    setFieldValue,
    max,
}) => {
    const value = getFieldValue(['shipment_items', recordId, 'quantity']) || 1;
    const disabled = !getFieldValue(['shipment_items', recordId]);

    const onChange = useCallback(
        (value) => {
            if (!value || +value > picked) return;
            setFieldValue(['shipment_items', recordId, 'quantity'], +value);
            updateQuantityToShip();
        },
        [picked, recordId, setFieldValue, updateQuantityToShip],
    );

    return <StyledInputNumber type="number" min={1} max={max} value={value} disabled={disabled} onChange={onChange} />;
};
