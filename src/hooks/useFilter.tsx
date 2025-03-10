import React, { useCallback } from 'react';
import { TFunction } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Filters, FilterTypes } from '@bo/keystone-components';

import { selectTypes } from '~/redux/selectors';
import { OrderStatusFilter } from '~/components';
import type { StatusGroups, GetStatusesResponse } from '~/models';

export const useFilter = (t: TFunction) => {
    const types = useSelector(selectTypes);
    const mapSpecialOptions = (name: string) =>
        !!types &&
        name in types &&
        // @ts-ignore
        types[name].map((value: string) => ({
            value,
            label: t(`type.${name}.${value}`),
        }));

    const getSpecialFilter = useCallback(
        (filter: Filters<StatusGroups, GetStatusesResponse>) => {
            const { type, key, label, tooltip } = filter;

            switch (type) {
                case FilterTypes.multiselectStatuses:
                    return (
                        <OrderStatusFilter
                            key={key}
                            name={key}
                            statusGroup={filter.statusGroup}
                            statusGroupBE={filter.statusGroupBE}
                            label={t(`filters.labels.${label}`)}
                            tooltip={tooltip && t(`filters.tooltips.${tooltip}`)}
                            placeholder={filter.placeholder && t(`filters.placeholders.${filter.placeholder}`)}
                            mode="multiple"
                            allowClear
                        />
                    );
                case FilterTypes.singleSelectStatus:
                    return (
                        <OrderStatusFilter
                            key={key}
                            name={key}
                            statusGroup={filter.statusGroup}
                            statusGroupBE={filter.statusGroupBE}
                            label={t(`filters.labels.${label}`)}
                            tooltip={tooltip && t(`filters.tooltips.${tooltip}`)}
                            placeholder={filter.placeholder && t(`filters.placeholders.${filter.placeholder}`)}
                            allowClear
                        />
                    );
                default:
                    return undefined;
            }
        },
        [t],
    );

    return { mapSpecialOptions, getSpecialFilter };
};
