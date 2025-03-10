import { Icon } from '@bo/component-library';
import { PickerDateProps } from 'antd/lib/date-picker/generatePicker';
import useModal from 'antd/lib/modal/useModal';
import { Dayjs } from 'dayjs';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { AddingProductsModal, OrderInfo } from '~/components';
import { useActions } from '~/hooks';
import {
    getSelectedProducts,
    selectOrderDetails,
    selectOrderTotals,
    selectSupplierConditions,
    selectSupplierMinAmount,
} from '~/redux/selectors';
import { orderCreationActions, orderDetailsActions } from '~/redux/slices';
import { ButtonBoldStyled, SpinStyled } from '~/style/commonStyle';
import { findClosestDate, getDeliveryDate, getModuleContext, getOrderDate } from '~/utils';

import { PageHeaderStyled } from './OrderDuplication.styled';

export const OrderDuplication: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { baseRoute } = useContext(getModuleContext());

    const { loading, data: orderDetails } = useSelector(selectOrderDetails);
    const selectedProducts = useSelector(getSelectedProducts);
    const conditions = useSelector(selectSupplierConditions);
    const { totalInclVat } = useSelector(selectOrderTotals);
    const minAmount = useSelector(selectSupplierMinAmount);

    const [modal, contextHolder] = useModal();
    const [isReadMode, setReadMode] = useState(true);
    const [isProductModalOpened, setIsProductModalOpened] = useState(false);
    const [entity, setEntity] = useState<{ label: string; value: string }>();
    const [orderDate, setOrderDate] = useState<Dayjs>();
    const [deliveryDate, setDeliveryDate] = useState<Dayjs>();

    const { getOrderDetailsRequest, resetOrderDetails } = useActions(orderDetailsActions);
    const {
        getProductsFromOrderLines,
        saveDraftOrder,
        clearSupplier,
        clearSelectedProducts,
        setSupplier,
        setSupplierConditions,
        getSuppliers,
        getSupplierCondition,
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
            >
                {t('common.edit')}
            </ButtonBoldStyled>
        ) : (
            <ButtonBoldStyled
                onClick={toggleEntitySelected}
                icon={<Icon name="check" size="sm" />}
                disabled={!entity}
                size="small"
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
    }, [baseRoute, deliveryDate, navigate, saveDraftOrder]);

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

    useEffect(() => {
        getSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        !!id && getOrderDetailsRequest(id);
    }, [getOrderDetailsRequest, id]);

    useEffect(() => {
        if (!orderDetails) return;
        if (orderDetails?.owner.id) {
            getSupplierCondition({ supplier: orderDetails.owner.id, customer: orderDetails.customer.account.id });
            setSupplier(orderDetails.owner.id);
        }
        setEntity({ label: orderDetails.owner.label, value: orderDetails.owner.id });
        getProductsFromOrderLines(orderDetails.order_lines);
    }, [getProductsFromOrderLines, getSupplierCondition, orderDetails, setSupplier]);

    useEffect(() => {
        if (!orderDate || !conditions) {
            return setDeliveryDate(undefined);
        }
        findClosestDate(getDeliveryDate(orderDate, conditions), setDeliveryDate, conditions.delivery_days);
    }, [conditions, orderDate]);

    useEffect(() => {
        conditions &&
            findClosestDate(getOrderDate(conditions.same_day_order_deadline), setOrderDate, conditions?.order_days);
    }, [conditions]);

    useEffect(() => {
        return () => {
            clearSupplier();
            clearSelectedProducts();
            resetOrderDetails();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <SpinStyled />;

    return (
        <div>
            {contextHolder}
            {isProductModalOpened && <AddingProductsModal close={hideModal} addProductKeys={addProductKeys} />}
            <PageHeaderStyled
                title={t('order_creation.title')}
                backIcon={<Icon name="arrow-left" />}
                onBack={onBack}
                extra={[
                    <ButtonBoldStyled disabled={shouldDisableSubmit} key="save-button" onClick={onSaveOrder}>
                        {t('common.save_draft')}
                    </ButtonBoldStyled>,
                ]}
            />
            <OrderInfo
                entity={entity}
                orderDate={orderDate}
                deliveryDate={deliveryDate}
                isReadMode={isReadMode}
                showModal={showModal}
                supplierPanelExtra={supplierPanelExtra}
                onChangeDate={onChangeDate}
                onChangeDeliveryDate={onChangeDeliveryDate}
                onEntityChange={onEntityChange}
                disabledDate={disabledDate}
                disabledDeliveryDate={disabledDeliveryDate}
            />
        </div>
    );
};
