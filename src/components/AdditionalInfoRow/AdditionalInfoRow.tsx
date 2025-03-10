import { IconNames, Color } from '@-bo/component-library';
import React, { FC } from 'react';

import { RowRoot, RowTitle, RowValue } from './AdditionalInfoRow.styled';
import { ConfigIcon } from '@-bo/keystone-components';

interface AdditionalInfoRowProps {
    label: React.ReactNode;
    value: string;
    icon?: [IconNames];
}

export const AdditionalInfoRow: FC<AdditionalInfoRowProps> = ({ label, value, icon }) => (
    <RowRoot>
        <RowTitle>
            <ConfigIcon icon={icon} color={Color.neutral(5)} size="sm" />
            {label}
        </RowTitle>
        <RowValue>{value}</RowValue>
    </RowRoot>
);
