import React, { FC, useCallback, useContext, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import useModal from 'antd/lib/modal/useModal';
import type { PickerDateProps } from 'antd/es/date-picker/generatePicker';
import type { Dayjs } from 'dayjs';
import { Icon } from '@bo/component-library';

import { QA_ORDER_CREATION_SUPPLIER_APPLY, QA_ORDER_CREATION_SUPPLIER_EDIT } from '~/const';
import { ButtonBoldStyled } from '~/style/commonStyle';
import { findClosestDate, getDeliveryDate, getOrderDate, getModuleContext } from '~/utils';
import { AddingProductsModal, OrderInfo } from '~/components';
import { useActions } from '~/hooks';
import { orderCreationActions } from '~/redux/slices';
import {
    selectSupplierConditions,
    getSelectedProducts,
    selectOrderTotals,
    selectSupplierMinAmount,
} from '~/redux/selectors';

import { PageHeaderStyled } from './OrderCreation.styled';

export const OrderCreation: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [modal, contextHolder] = useModal();
    const { baseRoute } = useContext(getModuleContext());

    const selectedProducts = useSelector(getSelectedProducts);
    const conditions = useSelector(selectSupplierConditions);
    const { totalInclVat } = useSelector(selectOrderTotals);
    const minAmount = useSelector(selectSupplierMinAmount);

    const [isProductModalOpened, setIsProductModalOpened] = useState(false);
    const [isReadMode, setReadMode] = useState(searchParams.has('isReadMode') || false);
    const [entity, setEntity] = useState<{ label: string; value: string }>();
    const [orderDate, setOrderDate] = useState<Dayjs>();
    const [deliveryDate, setDeliveryDate] = useState<Dayjs>();

    const {
        setSupplierConditions,
        setSupplier,
        clearSupplier,
        clearSelectedProducts,
        saveDraftOrder,
        getSuppliers,
        prefillOrderInfo,
        addProductKeys,
    } = useActions(orderCreationActions);

    const toggleEntitySelected = useCallback(() => {
        if (!isReadMode) {
            if (!entity) return;
            setSupplier(entity.value);
        }
        setReadMode((prevState) => !prevState);
    }, [entity, isReadMode, setSupplier]);

    const supplierPanelExtra = useMemo(() => {
        return isReadMode ? (
            <ButtonBoldStyled
                type="link"
                onClick={toggleEntitySelected}
                icon={<Icon name="edit" size="sm" />}
                size="small"
                className={QA_ORDER_CREATION_SUPPLIER_EDIT}
            >
                {t('common.edit')}
            </ButtonBoldStyled>
        ) : (
            <ButtonBoldStyled
                onClick={toggleEntitySelected}
                icon={<Icon name="check" size="sm" />}
                disabled={!entity}
                size="small"
                className={QA_ORDER_CREATION_SUPPLIER_APPLY}
            >
                {t('common.apply')}
            </ButtonBoldStyled>
        );
    }, [entity, isReadMode, t, toggleEntitySelected]);

    const shouldDisableSubmit = useMemo(() => {
        if (!selectedProducts.length) return true;
        return minAmount > totalInclVat;
    }, [minAmount, selectedProducts.length, totalInclVat]);

    const onBack = useCallback(() => {
        modal.confirm({
            title: t('modals.cancel_order_creation.title'),
            content: t('modals.cancel_order_creation.content'),
            okText: t('common.yes_cancel'),
            cancelText: t('common.go_back'),
            cancelButtonProps: {
                className: 'tertiary',
            },
            onOk: () => navigate(-1),
        });
    }, [modal, navigate, t]);

    const updateSupplierInfo = useCallback(
        (uuid, option) => {
            if (!uuid) {
                clearSupplier();
                setOrderDate(undefined);
                setDeliveryDate(undefined);
                getSuppliers();
            }
            setEntity(option);
            setSupplierConditions(option);
        },
        [setSupplierConditions, clearSupplier, getSuppliers],
    );

    const onChangeDate = useCallback((value) => {
        setOrderDate(value);
    }, []);

    const onChangeDeliveryDate = useCallback((value) => {
        setDeliveryDate(value);
    }, []);

    const onEntityChange = useCallback(
        (uuid, option) => {
            if (!!selectedProducts.length) {
                modal.confirm({
                    title: t('modals.change_supplier.title'),
                    content: t('modals.change_supplier.content'),
                    okText: t('common.confirm'),
                    cancelText: t('common.cancel'),
                    cancelButtonProps: {
                        className: 'tertiary',
                    },
                    onOk: () => {
                        clearSelectedProducts();
                        updateSupplierInfo(uuid, option);
                    },
                });
                return;
            }
            updateSupplierInfo(uuid, option);
        },
        [selectedProducts.length, updateSupplierInfo, modal, t, clearSelectedProducts],
    );

    const showModal = useCallback(() => {
        setIsProductModalOpened(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsProductModalOpened(false);
    }, []);

    const disabledDate: PickerDateProps<Dayjs>['disabledDate'] = useCallback(
        (current) => {
            if (!conditions) return true;

            return (
                current < getOrderDate(conditions.same_day_order_deadline).startOf('day') ||
                !conditions.order_days?.includes(current.isoWeekday())
            );
        },
        [conditions],
    );

    const disabledDeliveryDate: PickerDateProps<Dayjs>['disabledDate'] = useCallback(
        (current) => {
            if (!conditions || !orderDate) return true;
            return (
                current < getDeliveryDate(orderDate, conditions).startOf('day') ||
                !conditions.delivery_days?.includes(current.isoWeekday())
            );
        },
        [conditions, orderDate],
    );

    const onSaveOrder = useCallback(() => {
        !!deliveryDate && saveDraftOrder({ navigate, baseRoute, deliveryDate });
    }, [baseRoute, navigate, saveDraftOrder, deliveryDate]);

    useEffect(() => {
        prefillOrderInfo(searchParams);
        getSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!orderDate || !conditions) {
            return setDeliveryDate(undefined);
        }
        findClosestDate(getDeliveryDate(orderDate, conditions), setDeliveryDate, conditions.delivery_days);
        setEntity({ value: conditions.owner.id, label: conditions.owner.label });
    }, [conditions, orderDate]);

    useEffect(() => {
        conditions &&
            findClosestDate(getOrderDate(conditions.same_day_order_deadline), setOrderDate, conditions?.order_days);
    }, [conditions]);

    useEffect(() => {
        return () => {
            clearSupplier();
            clearSelectedProducts();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {contextHolder}
            {isProductModalOpened && <AddingProductsModal close={hideModal} addProductKeys={addProductKeys} />}
            <PageHeaderStyled
                extra={[
                    <ButtonBoldStyled disabled={shouldDisableSubmit} key="save-button" onClick={onSaveOrder}>
                        {t('common.save_draft')}
                    </ButtonBoldStyled>,
                ]}
                title={t('order_creation.title')}
                backIcon={<Icon name="arrow-left" />}
                onBack={onBack}
            />
            <OrderInfo
                entity={entity}
                orderDate={orderDate}
                deliveryDate={deliveryDate}
                onEntityChange={onEntityChange}
                isReadMode={isReadMode}
                onChangeDate={onChangeDate}
                onChangeDeliveryDate={onChangeDeliveryDate}
                showModal={showModal}
                supplierPanelExtra={supplierPanelExtra}
                disabledDate={disabledDate}
                disabledDeliveryDate={disabledDeliveryDate}
            />
        </div>
    );
};
