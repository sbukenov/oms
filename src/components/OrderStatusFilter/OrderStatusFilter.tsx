import Select, { SelectProps } from 'antd/lib/select';
import { StyledFormItem } from '@bo/keystone-components';
import Badge from 'antd/lib/badge';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Color, Icon } from '@bo/component-library';
import { getDefaultPopupContainer, filterOptionBy } from '@bo/utils';

import type { StatusGroups, GetStatusesResponse, StatusOption } from '~/models';
import { selectOrdersStatuses } from '~/redux/selectors';
import { STATUSES } from '~/const';
import { getModuleContext } from '~/utils';

import { OrderStatusOption } from './OrderStatusFilter.styled';

interface OrderStatusFilterProps extends Omit<SelectProps, 'options'> {
    statusGroup: StatusGroups;
    statusGroupBE: keyof GetStatusesResponse;
    label: string;
    name?: string;
    tooltip?: string;
}

export const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
    statusGroup,
    statusGroupBE,
    label,
    tooltip,
    name,
    ...restProps
}) => {
    const { i18n } = useTranslation();
    const { config } = useContext(getModuleContext());
    const statuses = useSelector(selectOrdersStatuses);

    const group = config?.specific?.statuses?.[statusGroup] || STATUSES[statusGroup];

    const options = statuses?.[statusGroupBE]?.map((status) => ({
        value: status,
        // @ts-ignore
        label: (group && group[status]?.title && group[status].title[i18n.resolvedLanguage]) || status,
        // @ts-ignore
        color: (group && group[status]?.color) || Color.neutral(7),
    }));

    if (!options) {
        return null;
    }

    return (
        <StyledFormItem label={label} tooltip={tooltip} name={name || statusGroup}>
            <Select<any, StatusOption>
                filterOption={filterOptionBy('title')}
                getPopupContainer={getDefaultPopupContainer}
                showArrow
                suffixIcon={<Icon name="chevron-down" size="sm" />}
                {...restProps}
            >
                {options?.map(({ label, value, color }) => (
                    <Select.Option key={value} value={value} title={label}>
                        <OrderStatusOption>
                            <Badge color={color} text={label} />
                        </OrderStatusOption>
                    </Select.Option>
                ))}
            </Select>
        </StyledFormItem>
    );
};
