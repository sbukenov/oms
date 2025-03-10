import { Icon } from '@bo/component-library';
import useModal from 'antd/lib/modal/useModal';
import dayjs from 'dayjs';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { AddingProductsModal, OrderInfo, Status } from '~/components';
import { DEFAULT_DATE_FORMAT, ROUTE_ORDER } from '~/const';
import { useActions } from '~/hooks';
import { selectOrderDetails } from '~/redux/selectors';
import { orderCreationActions, orderDetailsActions } from '~/redux/slices';
import { OverflowHiddenText, SpinStyled } from '~/style/commonStyle';
import { getModuleContext, showSuccessNotification } from '~/utils';

import { PageHeaderStyled, DateWrapper, IconStyled } from './OrderEdition.styled';
import { OrderEditionExtra } from './OrderEditionExtra';

export const OrderEdition: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { baseRoute } = useContext(getModuleContext());
    const [modal, contextHolder] = useModal();
    const { id } = useParams();

    const { loading, data: orderDetails } = useSelector(selectOrderDetails);

    const [isProductModalOpened, setIsProductModalOpened] = useState(false);

    const { getOrderDetailsRequest, resetOrderDetails } = useActions(orderDetailsActions);
    const {
        getSupplierCondition,
        getProductsFromOrderLines,
        editOrder,
        clearSupplier,
        clearSelectedProducts,
        setSupplier,
        addProductKeys,
    } = useActions(orderCreationActions);

    const onBack = useCallback(() => {
        modal.confirm({
            title: t('modals.cancel_order_edition.title'),
            content: t('modals.cancel_order_edition.content'),
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

    const onSuccess = useCallback(() => {
        navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}`);
        showSuccessNotification({
            message: t('common.success'),
            description: t('notifications.order_updated'),
        });
    }, [baseRoute, id, navigate, t]);

    const onSave = useCallback(() => {
        !!id && editOrder({ orderId: id, onSuccess });
    }, [editOrder, id, onSuccess]);

    useEffect(() => {
        !!id && getOrderDetailsRequest(id);
    }, [getOrderDetailsRequest, id]);

    useEffect(() => {
        if (!orderDetails) return;
        if (orderDetails?.owner.id) {
            getSupplierCondition({ supplier: orderDetails.owner.id, customer: orderDetails.customer.account.id });
            setSupplier(orderDetails.owner.id);
        }
        getProductsFromOrderLines(orderDetails.order_lines);
    }, [getProductsFromOrderLines, getSupplierCondition, orderDetails, setSupplier]);

    useEffect(() => {
        return () => {
            clearSupplier();
            clearSelectedProducts();
            resetOrderDetails();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <SpinStyled />;

    const entity = { label: orderDetails?.owner.label || '', value: orderDetails?.owner.id || '' };
    const orderDate = dayjs(orderDetails?.created_at);
    const deliveryDate = dayjs(orderDetails?.promised_delivery_date);

    return (
        <div>
            {contextHolder}
            {isProductModalOpened && <AddingProductsModal close={hideModal} addProductKeys={addProductKeys} />}
            <PageHeaderStyled
                title={orderDetails?.reference}
                subTitle={
                    <>
                        <DateWrapper>
                            <IconStyled name="calendar" size="md" verticalAlign="sub" />
                            <OverflowHiddenText>{`${t('order.created_at')} ${dayjs(orderDetails?.created_at).format(
                                DEFAULT_DATE_FORMAT,
                            )}`}</OverflowHiddenText>
                        </DateWrapper>
                        <Status group="order" code={orderDetails?.status} />
                    </>
                }
                backIcon={<Icon name="arrow-left" />}
                onBack={onBack}
                extra={<OrderEditionExtra onBack={onBack} onSave={onSave} />}
            />
            <OrderInfo
                entity={entity}
                orderDate={orderDate}
                deliveryDate={deliveryDate}
                isReadMode={true}
                showModal={showModal}
            />
        </div>
    );
};
