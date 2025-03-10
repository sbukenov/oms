import { EmptyImage, StyledFormItem } from '@bo/keystone-components';
import { Icon, Color } from '@bo/component-library';
import { ColumnConfigBase, formatPrice, getRawAmountValue, useColumnConfiguration, useModal } from '@-bo/utils';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Input from 'antd/lib/input';
import type { TableProps, ColumnProps } from 'antd/lib/table';
import React, { ChangeEventHandler, FC, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import {
    CONFIG_COLUMN_ORDER_LINES_LIST,
    DEFAULT_DASH,
    QA_ORDER_DELIVERY_ADDITION,
    ROUTE_ORDER,
    ROUTE_RECEPTION,
    SHORT_CONFIG_COLUMN_ORDER_LINES_LIST,
    UNEXPECTED_TYPE,
} from '~/const';
import { useActions } from '~/hooks';
import type { LogisticUnit, OrderLine, OrderLinesQuantitiesById, Price } from '~/models';
import {
    getOwnerId,
    getSupplier,
    selectIsAddingNewDelivery,
    selectOrderDetailsId,
    selectOrderLinesWithUnexpected,
} from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import { ButtonBoldStyled, ImageStyled, TableFooter, TableThinStyled } from '~/style/commonStyle';
import { getModuleContext } from '~/utils';

import { StyledModal, StyledModalFooter, StyledInputNumber, StyledRow } from './DeliveryAdditionModal.styled';
import { AddingProductsModal } from '../addingProductsModal';

interface DeliveryAdditionModalProps {
    close: () => void;
    closeParentModal: () => void;
    tableConfig?: ColumnConfigBase<any>[];
}

export const DeliveryAdditionModal: FC<DeliveryAdditionModalProps> = ({
    close,
    closeParentModal,
    tableConfig = SHORT_CONFIG_COLUMN_ORDER_LINES_LIST,
}) => {
    const { isModalShowed, showModal, hideModal } = useModal();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { baseRoute } = useContext(getModuleContext());
    const [selectedProductsById, setSelectedProductsById] = useState<OrderLinesQuantitiesById>({});
    const [reference, setReference] = useState('');
    const lines = useSelector(selectOrderLinesWithUnexpected);
    const supplier = useSelector(getSupplier);
    const ownerId = useSelector(getOwnerId);
    const id = useSelector(selectOrderDetailsId);
    const isLoading = useSelector(selectIsAddingNewDelivery);
    const { resetUnexpectedProducts, addNewDelivery, addUnexpectedProductKeys, deleteUnexpectedProducts } =
        useActions(orderDetailsActions);
    useEffect(() => {
        return () => {
            resetUnexpectedProducts();
        };
    }, [resetUnexpectedProducts]);
    const defaultColumnsToProps = useMemo(
        () => ({
            IMAGE: {
                dataIndex: ['packaging', 'product', 'image_url'],
                render: (url: OrderLine['packaging']['product']['image_url']) =>
                    url ? <ImageStyled src={url} /> : <EmptyImage />,
            },
            QUANTITY: {
                title: t('common.quantity'),
                align: 'center',
                dataIndex: 'quantity',
                render: (quantity: number, record: OrderLine) => {
                    if (selectedProductsById[record.id] !== undefined) {
                        return (
                            <StyledInputNumber
                                type="number"
                                size="middle"
                                min={0}
                                max={record.type !== UNEXPECTED_TYPE ? quantity : undefined}
                                value={selectedProductsById[record.id]?.quantity || quantity}
                                onChange={(value) => {
                                    setSelectedProductsById({
                                        ...selectedProductsById,
                                        [record.id]: { ...selectedProductsById[record.id], quantity: value },
                                    });
                                }}
                            />
                        );
                    }
                    return <span>{quantity}</span>;
                },
            },
            UNIT_PRICE: {
                title: t('common.unit_price'),
                align: 'center',
                dataIndex: 'unit_price_including_vat',
                render: (unitPrice: Price, record: OrderLine) => {
                    if (selectedProductsById[record.id] !== undefined) {
                        return (
                            <StyledInputNumber
                                type="number"
                                size="middle"
                                min={0}
                                value={selectedProductsById[record.id]?.price || getRawAmountValue(unitPrice)}
                                onChange={(value) => {
                                    setSelectedProductsById({
                                        ...selectedProductsById,
                                        [record.id]: { ...selectedProductsById[record.id], price: value },
                                    });
                                }}
                            />
                        );
                    }
                    return <span>{formatPrice(unitPrice)}</span>;
                },
            },
            TOTAL_OUTER: {
                title: t('common.total_outer'),
                align: 'center',
                render: (record: OrderLine) => {
                    const currentQuantity = selectedProductsById[record.id]?.quantity || record.quantity;
                    return currentQuantity * record?.packaging?.product_per_packaging;
                },
            },
            TRASH: {
                width: 48,
                render: (record: LogisticUnit) => {
                    if (record.type !== UNEXPECTED_TYPE) return null;
                    return (
                        <Button
                            type="link"
                            onClick={() => {
                                deleteUnexpectedProducts(record.auto_id!);
                            }}
                        >
                            <Icon name="trash" size="sm" color={Color.neutral(6)} />
                        </Button>
                    );
                },
            },
        }),
        [deleteUnexpectedProducts, selectedProductsById, t],
    );

    const columns: ColumnProps<OrderLine>[] = useColumnConfiguration(
        tableConfig,
        undefined,
        CONFIG_COLUMN_ORDER_LINES_LIST,
        defaultColumnsToProps,
        QA_ORDER_DELIVERY_ADDITION,
    );

    const rowSelection = useMemo<TableProps<OrderLine>['rowSelection']>(
        () => ({
            type: 'checkbox',
            onChange: (_, rows) => {
                setSelectedProductsById(
                    rows.reduce((acc: OrderLinesQuantitiesById, item) => {
                        if (selectedProductsById[item.id]) {
                            acc[item.id] = selectedProductsById[item.id];
                        } else {
                            acc[item.id] = {
                                type: item.type,
                                packaging: !!item.packaging && { ...item.packaging },
                                quantity: item.quantity,
                                price: getRawAmountValue(item.unit_price_including_vat),
                            };
                        }
                        return acc;
                    }, {}),
                );
            },
        }),
        [selectedProductsById],
    );

    const locale = useMemo(
        () => ({ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> }),
        [t],
    );

    const shouldDisableSubmit = useMemo(
        () => !Object.keys(selectedProductsById).length || !reference.length,
        [selectedProductsById, reference.length],
    );

    const handleReferenceChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setReference(e.target.value);
    }, []);

    const closeAll = useCallback(() => {
        close();
        closeParentModal();
    }, [close, closeParentModal]);

    const handleAdd = useCallback(() => {
        addNewDelivery({
            addAndReceive: false,
            reference,
            selectedProductsById,
            onSuccess: (route: string) => {
                closeAll();
                navigate(`/${baseRoute}/${ROUTE_ORDER}/${id}/${route}`);
            },
        });
    }, [addNewDelivery, baseRoute, closeAll, id, navigate, selectedProductsById, reference]);

    const handleAddAndReceive = useCallback(() => {
        if (!id) throw new Error('No order id');

        addNewDelivery({
            addAndReceive: true,
            reference,
            selectedProductsById,
            onSuccess: (route: string) => {
                const params = new URLSearchParams({
                    order: id,
                }).toString();

                closeAll();
                navigate(`/${baseRoute}/${ROUTE_RECEPTION}/${route}?${params}`);
            },
        });
    }, [addNewDelivery, baseRoute, closeAll, id, navigate, selectedProductsById, reference]);

    return (
        <>
            {isModalShowed && (
                <AddingProductsModal close={hideModal} supplier={ownerId} addProductKeys={addUnexpectedProductKeys} />
            )}
            <StyledModal
                visible
                onCancel={close}
                title={t('modals.order_reception.add_new_delivery')}
                footer={
                    <StyledModalFooter>
                        <Button type="link" onClick={close} loading={isLoading}>
                            {t('common.cancel')}
                        </Button>
                        <Button disabled={shouldDisableSubmit} onClick={handleAdd} loading={isLoading}>
                            {t('common.add')}
                        </Button>
                        <Button
                            disabled={shouldDisableSubmit}
                            onClick={handleAddAndReceive}
                            type="primary"
                            loading={isLoading}
                        >
                            {t('modals.order_reception.add_and_receive')}
                        </Button>
                    </StyledModalFooter>
                }
            >
                <StyledRow>
                    <StyledFormItem label={t('modals.order_reception.delivery_reference')} required>
                        <Input value={reference} onChange={handleReferenceChange} required />
                    </StyledFormItem>
                    <StyledFormItem label={t('common.supplier')}>{supplier?.label || DEFAULT_DASH}</StyledFormItem>
                </StyledRow>
                <TableThinStyled
                    rowKey="id"
                    columns={columns}
                    // @ts-ignore
                    dataSource={lines}
                    pagination={false}
                    rowSelection={rowSelection}
                    locale={locale}
                    footer={() => (
                        <TableFooter>
                            <ButtonBoldStyled icon={<Icon name="add" size="sm" />} type="link" onClick={showModal}>
                                {t('reception_details.add_unexpected_item')}
                            </ButtonBoldStyled>
                        </TableFooter>
                    )}
                />
            </StyledModal>
        </>
    );
};
