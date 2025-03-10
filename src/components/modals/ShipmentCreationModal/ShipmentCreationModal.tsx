import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Empty from 'antd/lib/empty';
import { ColumnProps, TableProps } from 'antd/lib/table';
import Form from 'antd/lib/form';
import { Alert, Icon } from '@bo/component-library';
import { CustomActionConfigurationShort } from '@-bo/utils';

import { FulfillmentItem, ShipmentItemShort } from '~/models';
import { filerShortShipmentItems, getShipmentItemQuantity, mapFulfillmentItems, showReference } from '~/utils';
import { Counter, OverflowHiddenText } from '~/style/commonStyle';
import { DEFAULT_DASH, shipmentCreationInitialValues } from '~/const';
import { fulfillmentsActions, shipmentsActions } from '~/redux/slices';
import { useActions } from '~/hooks';
import { selectCreatingShipment, selectFulfillmentPreparation, selectOrderDetailsData } from '~/redux/selectors';
import { ShipmentCreationQuantityInput } from '~/components/ShipmentCreationQuantityInput';

import {
    StyledModal,
    LabelStyled,
    ReferenceWrapper,
    StyledTable,
    StyledText,
    ActionTextContent,
    CounterWrapper,
} from './ShipmentCreationModal.styled';

interface ShipmentCreationModalProps {
    selectedAction: CustomActionConfigurationShort;
    fulfillmentId: string;
    ownerId: string;
    close: () => void;
}

type FormType = { shipment_items: Record<string, ShipmentItemShort | null> };

export const ShipmentCreationModal: FC<ShipmentCreationModalProps> = ({
    selectedAction,
    fulfillmentId,
    ownerId,
    close,
}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormType>();
    const { data: fulfillmentDetailed, loading } = useSelector(selectFulfillmentPreparation);
    const order = useSelector(selectOrderDetailsData);
    const isCreatingShipment = useSelector(selectCreatingShipment);
    const [formValid, setFormValid] = useState(false);
    const [itemsToShip, setItemsToShip] = useState(0);
    const { getFulfillmentDetails, resetFulfillmentPreparation } = useActions(fulfillmentsActions);
    const { createShipment } = useActions(shipmentsActions);

    const { setFieldValue, getFieldValue, submit } = form;

    const updateQuantityToShip = useCallback(() => {
        setItemsToShip(
            Object.values(getFieldValue('shipment_items') as FormType).reduce((acc: number, current) => {
                if (!current) return acc;
                return (current as unknown as ShipmentItemShort).quantity + acc;
            }, 0),
        );
    }, [getFieldValue]);

    const columns: ColumnProps<FulfillmentItem>[] = useMemo(
        () => [
            {
                title: t('modals.shipment_creation.product'),
                dataIndex: 'label',
                width: '25%',
                render: (label: string, fulfillmentItem) => (
                    <LabelStyled>
                        {fulfillmentItem.isSubstitute && <Icon name="substitution" />}
                        <OverflowHiddenText>{label}</OverflowHiddenText>
                    </LabelStyled>
                ),
            },
            {
                title: t('modals.shipment_creation.ordered'),
                dataIndex: ['quantity', 'quantity'],
                align: 'center',
                render: (quantity: number, fulfillmentItem) =>
                    fulfillmentItem.isSubstitute ? DEFAULT_DASH : quantity || DEFAULT_DASH,
            },
            {
                title: t('modals.shipment_creation.prepared'),
                dataIndex: ['fulfilled_items_quantities', 'PICKED'],
                align: 'center',
            },
            {
                title: t('modals.shipment_creation.out_of_stock'),
                dataIndex: ['fulfilled_items_quantities', 'OUT_OF_STOCK'],
                align: 'center',
                render: (value) => value || DEFAULT_DASH,
            },
            {
                title: t('modals.shipment_creation.substituted'),
                dataIndex: ['fulfilled_items_quantities', 'SUBSTITUTE'],
                align: 'center',
                render: (value) => value || DEFAULT_DASH,
            },
            {
                title: t('modals.shipment_creation.quantity_to_ship'),
                align: 'center',
                width: 98,
                shouldCellUpdate: () => true,
                render: (_, record) => {
                    const { PICKED } = record.fulfilled_items_quantities;
                    const max = getShipmentItemQuantity(order?.order_lines, record);
                    return (
                        !!PICKED && (
                            <Form.Item shouldUpdate noStyle>
                                {() => (
                                    <ShipmentCreationQuantityInput
                                        picked={PICKED}
                                        recordId={record.id}
                                        getFieldValue={getFieldValue}
                                        setFieldValue={setFieldValue}
                                        updateQuantityToShip={updateQuantityToShip}
                                        max={max}
                                    />
                                )}
                            </Form.Item>
                        )
                    );
                },
            },
        ],
        [getFieldValue, order?.order_lines, setFieldValue, t, updateQuantityToShip],
    );

    const rowSelection: TableProps<FulfillmentItem>['rowSelection'] = useMemo(
        () => ({
            onSelect: (record, selected) => {
                if (selected) {
                    setFieldValue(['shipment_items', record.id], {
                        order_line: record.order_line.id,
                        quantity: getShipmentItemQuantity(order?.order_lines, record),
                    });
                } else {
                    setFieldValue(['shipment_items', record.id], null);
                }
                setFormValid(!!Object.values(getFieldValue('shipment_items')).find(Boolean));
                updateQuantityToShip();
            },
            getCheckboxProps: (record) => ({
                disabled: !record.fulfilled_items_quantities.PICKED,
            }),
            hideSelectAll: true,
        }),
        [getFieldValue, order?.order_lines, setFieldValue, updateQuantityToShip],
    );

    const remainingFulfillmentItems = useMemo(() => {
        return fulfillmentDetailed?.fulfillment_items?.filter((item) => {
            const line = order?.order_lines.find(({ id }) => id === item.order_line.id);
            return !!line?.delivery_items_quantities.left_for_ship;
        });
    }, [fulfillmentDetailed?.fulfillment_items, order?.order_lines]);

    const onFinish = useCallback(
        (values: FormType) => {
            const shipment_items = Object.values(values.shipment_items).filter(filerShortShipmentItems);

            createShipment({
                issuer: ownerId,
                type: 'direct_delivery',
                shipment_items,
                onSuccess: close,
            });
        },
        [close, createShipment, ownerId],
    );

    const confirmCancellation = useCallback(() => {
        if (!formValid) {
            close();
            return;
        }
        Alert.confirm({
            title: t('modals.cancel_shipment_creation.title'),
            content: t('modals.cancel_shipment_creation.content'),
            okText: t('common.yes_quit'),
            cancelText: t('common.go_back'),
            onOk: close,
        });
    }, [formValid, t, close]);

    useEffect(() => {
        getFulfillmentDetails(fulfillmentId);
    }, [fulfillmentId, getFulfillmentDetails]);

    useEffect(() => {
        return () => {
            resetFulfillmentPreparation();
        };
    }, [resetFulfillmentPreparation]);

    const locale = {
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('modals.shipment_creation.no_data')} />,
    };

    return (
        <StyledModal
            onCancel={confirmCancellation}
            onOk={submit}
            visible
            title={
                <>
                    {selectedAction.label}
                    <ReferenceWrapper>{showReference(fulfillmentDetailed?.reference)}</ReferenceWrapper>
                </>
            }
            okButtonProps={{
                disabled: !formValid,
                loading: isCreatingShipment,
            }}
            cancelButtonProps={{ type: 'link', loading: isCreatingShipment }}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
        >
            <Form form={form} initialValues={shipmentCreationInitialValues} onFinish={onFinish} component={false}>
                <ActionTextContent>
                    <StyledText>{t('modals.shipment_creation.add_products_to_ship')}</StyledText>
                    <CounterWrapper>
                        {t('modals.shipment_creation.items_to_ship')} <Counter>{itemsToShip}</Counter>
                    </CounterWrapper>
                </ActionTextContent>
                <Form.Item name="shipment_items" noStyle />
                <StyledTable
                    rowKey="id"
                    columns={columns}
                    rowSelection={rowSelection}
                    loading={loading}
                    dataSource={mapFulfillmentItems(remainingFulfillmentItems)}
                    pagination={false}
                    locale={locale}
                />
            </Form>
        </StyledModal>
    );
};
