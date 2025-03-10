import React, { FC } from 'react';
import Tooltip from 'antd/lib/tooltip';
import { Color, Icon } from '@bo/component-library';
import type { MappedLine } from '@bo/utils';
import get from 'lodash/get';

import type { Fulfillment, OrderReturn, ShipmentShort, Transaction } from '~/models';

import { AdditionalInfoRow } from '../AdditionalInfoRow';
import { overlayInnerStyle, StyledOverlay, StyledTooltipButton } from './AdditionalInfoTooltip.styled';
import { ReplenishmentOperation } from '../../models';

interface AdditionaInfoTooltipProps {
    additionalInfoConfig?: MappedLine[];
    className: string;
    data: {
        fulfillment?: Fulfillment;
        shipment?: ShipmentShort;
        transaction?: Transaction;
        orderReturn?: OrderReturn;
        reception?: ReplenishmentOperation;
        expedition?: ReplenishmentOperation;
    };
}

export const AdditionalInfoTooltip: FC<AdditionaInfoTooltipProps> = ({ className, additionalInfoConfig, data }) => {
    if (!additionalInfoConfig) {
        return <Icon className={className} name="information" color={Color.primary(8)} />;
    }

    return (
        <Tooltip
            className={className}
            overlay={
                <StyledOverlay className={`${className}Tooltip`}>
                    {additionalInfoConfig.map((line, index) => {
                        const itemData = get(data, line.path);
                        const result = line.render ? line.render(itemData, line, index) : itemData;
                        return <AdditionalInfoRow key={index} label={line.title} value={result} icon={line.icon} />;
                    })}
                </StyledOverlay>
            }
            showArrow={false}
            trigger={['hover', 'focus']}
            overlayInnerStyle={overlayInnerStyle}
            placement="rightTop"
            overlayClassName="overlay-with-white-arrow"
        >
            <StyledTooltipButton type="link">
                <Icon className={className} name="information" color={Color.primary(8)} />
            </StyledTooltipButton>
        </Tooltip>
    );
};
