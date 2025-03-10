import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { Dayjs } from 'dayjs';
import type { PickerDateProps } from 'antd/lib/date-picker/generatePicker';
import { Icon } from '@bo/component-library';
import { SelectInfinityScroll } from '@bo/keystone-components';
import { SHORT_DATE_FORMAT } from '@bo/utils';

import {
    DEFAULT_DASH,
    QA_ORDER_CREATION_EXPECTED_DELIVERY_DATE,
    QA_ORDER_CREATION_ORDER_DATE,
    QA_ORDER_CREATION_SUPPLIER,
} from '~/const';
import { ConditionsTable } from '~/container/orderCreation/ConditionsTable';
import { ProductsCreationTable } from '~/container/orderCreation/ProductsCreationTable';
import { useActions } from '~/hooks';
import { selectNextSuppliers, selectSuppliers, selectSuppliersLoading } from '~/redux/selectors';
import { orderCreationActions } from '~/redux/slices';
import { ButtonBoldStyled, LabelStyled } from '~/style/commonStyle';

import { Panel } from '../Panel';
import { ProductsSearch } from '../ProductsSearch';
import {
    DatePickerStyled,
    DatesBlock,
    SupplierLeftBlock,
    SupplierStyled,
    TextStyled,
    Wrapper,
} from './OrderInfo.styled';

interface OrderInfoProps {
    entity?: { label: string; value: string };
    orderDate?: Dayjs;
    deliveryDate?: Dayjs;
    onEntityChange?: (value: any, option: any) => void;
    isReadMode: boolean;
    onChangeDate?: (value: any) => void;
    onChangeDeliveryDate?: (value: any) => void;
    showModal: () => void;
    supplierPanelExtra?: JSX.Element;
    disabledDate?: PickerDateProps<Dayjs>['disabledDate'];
    disabledDeliveryDate?: PickerDateProps<Dayjs>['disabledDate'];
}

export const OrderInfo: FC<OrderInfoProps> = ({
    entity,
    orderDate,
    deliveryDate,
    onEntityChange,
    isReadMode,
    onChangeDate,
    onChangeDeliveryDate,
    showModal,
    supplierPanelExtra,
    disabledDate,
    disabledDeliveryDate,
}) => {
    const { t } = useTranslation();
    const { searchSuppliers, loadNextSuppliers } = useActions(orderCreationActions);
    const suppliers = useSelector(selectSuppliers);
    const next = useSelector(selectNextSuppliers);
    const isLoading = useSelector(selectSuppliersLoading);
    const options = suppliers?.map((supplier) => ({
        label: supplier.owner.label,
        value: supplier.owner.id,
        ...supplier,
    }));

    return (
        <Wrapper>
            <Panel iconName="stock" label={t('common.supplier')} extra={supplierPanelExtra}>
                <SupplierStyled>
                    <SupplierLeftBlock>
                        <LabelStyled className={QA_ORDER_CREATION_SUPPLIER}>
                            <span>{`${t('order_creation.supplier_name')}*`}</span>
                            {isReadMode ? (
                                <TextStyled>{entity?.label}</TextStyled>
                            ) : (
                                <SelectInfinityScroll
                                    placeholder={t('filters.placeholders.select')}
                                    options={options}
                                    dataLength={options.length}
                                    onChange={onEntityChange}
                                    onSearch={searchSuppliers}
                                    value={entity}
                                    loading={isLoading}
                                    showSearch
                                    allowClear
                                    loader={<>{t('common.loading')}</>}
                                    loadNext={loadNextSuppliers}
                                    hasMore={!!next}
                                />
                            )}
                        </LabelStyled>
                        <DatesBlock>
                            <LabelStyled className={QA_ORDER_CREATION_ORDER_DATE}>
                                <span>{`${t('order_creation.order_date')}*`}</span>
                                {isReadMode ? (
                                    <TextStyled>
                                        {orderDate?.format(SHORT_DATE_FORMAT)}
                                        <Icon name="calendar" size="sm" />
                                    </TextStyled>
                                ) : (
                                    <DatePickerStyled
                                        format={SHORT_DATE_FORMAT}
                                        disabled={!entity}
                                        value={orderDate}
                                        disabledDate={disabledDate}
                                        onChange={onChangeDate}
                                        allowClear={false}
                                        suffixIcon={<Icon name="calendar" size="sm" />}
                                    />
                                )}
                            </LabelStyled>
                            <LabelStyled className={QA_ORDER_CREATION_EXPECTED_DELIVERY_DATE}>
                                <span>{`${t('order_creation.delivery_date')}*`}</span>
                                {isReadMode ? (
                                    <TextStyled>
                                        {deliveryDate ? deliveryDate.format(SHORT_DATE_FORMAT) : DEFAULT_DASH}
                                        <Icon name="calendar" size="sm" />
                                    </TextStyled>
                                ) : (
                                    <DatePickerStyled
                                        format={SHORT_DATE_FORMAT}
                                        disabled={!entity}
                                        value={deliveryDate}
                                        disabledDate={disabledDeliveryDate}
                                        onChange={onChangeDeliveryDate}
                                        allowClear={false}
                                        suffixIcon={<Icon name="calendar" size="sm" />}
                                    />
                                )}
                            </LabelStyled>
                        </DatesBlock>
                    </SupplierLeftBlock>
                    <ConditionsTable />
                </SupplierStyled>
            </Panel>
            <Panel
                iconName="add-basket"
                label={t('common.products')}
                disabled={!isReadMode}
                footer={<ProductsCreationTable disabled={!isReadMode} />}
            >
                <ProductsSearch />
                <ButtonBoldStyled onClick={showModal}>{t('common.browse')}</ButtonBoldStyled>
            </Panel>
        </Wrapper>
    );
};
