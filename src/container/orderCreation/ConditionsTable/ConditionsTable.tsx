import Skeleton from 'antd/lib/skeleton';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DEFAULT_CURRENCY, formatPrice, getSelectedEntity } from '@bo/utils';

import {
    DEFAULT_DASH,
    HOUR_MINUTE_TIME_FORMAT,
    QA_ORDER_CREATION_SUPPLIER_CONDITIONS,
    TIME_WITH_TIMEZONE_FORMAT,
} from '~/const';
import { selectSupplierConditions, selectSupplierConditionsLoading } from '~/redux/selectors';
import { printDays } from '~/utils';

import { ConditionsWrapper } from './ConditionsTable.styled';

export const ConditionsTable: FC = () => {
    const {
        t,
        i18n: { resolvedLanguage: language },
    } = useTranslation();
    const conditions = useSelector(selectSupplierConditions);
    const isLoading = useSelector(selectSupplierConditionsLoading);

    const currency: string | undefined = getSelectedEntity()?.currency?.iso_code || DEFAULT_CURRENCY;

    return (
        <ConditionsWrapper className={QA_ORDER_CREATION_SUPPLIER_CONDITIONS}>
            <Skeleton loading={isLoading}>
                <table>
                    <tbody>
                        <tr>
                            <th>{t('order_creation.order_days')}:</th>
                            <td>{printDays(conditions?.order_days) || DEFAULT_DASH}</td>
                        </tr>
                        <tr>
                            <th>{t('order_creation.order_deadline')}:</th>
                            <td>
                                {conditions?.same_day_order_deadline
                                    ? dayjs(conditions.same_day_order_deadline, TIME_WITH_TIMEZONE_FORMAT).format(
                                          HOUR_MINUTE_TIME_FORMAT,
                                      )
                                    : DEFAULT_DASH}
                            </td>
                        </tr>
                        <tr>
                            <th>{t('order_creation.delivery_delay')}:</th>
                            <td>
                                {conditions?.delivery_delay
                                    ? `${conditions.delivery_delay} ${t('common.day', {
                                          count: conditions.delivery_delay,
                                      })}`
                                    : DEFAULT_DASH}
                            </td>
                        </tr>
                        <tr>
                            <th>{t('order_creation.delivery_days')}:</th>
                            <td>{printDays(conditions?.delivery_days) || DEFAULT_DASH}</td>
                        </tr>
                        <tr>
                            <th>{t('order_creation.min_amount')}:</th>
                            <td>
                                {conditions?.min_amount
                                    ? formatPrice(conditions.min_amount, currency, language)
                                    : DEFAULT_DASH}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Skeleton>
        </ConditionsWrapper>
    );
};
