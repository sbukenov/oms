import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Alert } from '@bo/component-library';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Typography from 'antd/lib/typography';
import Tag from 'antd/lib/tag';
import Tooltip from 'antd/lib/tooltip';
import type { ColumnProps } from 'antd/lib/table';
import { mapIdToValueOption } from '@-bo/utils';
import { SelectFilter } from '@-bo/keystone-components';

import type { OrderFull, OrderLinesToReturn, CommonReturnInfo } from '~/models';
import {
    showReference,
    changeQuantityItemLine,
    changeQuantityOrderLine,
    changeReasonItemLine,
    changeReasonOrderLine,
    addItemLine,
    deleteItemLine,
    mapReturns,
    getItems,
    sumItemsToReturn,
} from '~/utils';
import { useActions } from '~/hooks';
import {
    selectOrdersBusinessUnits,
    selectOrderLinesForReturn,
    selectActiveReturnReasons,
    selectLoadingOrder,
    selectReturnTypes,
} from '~/redux/selectors';
import { businessUnitsActions, returnsActions } from '~/redux/slices';
import { Counter } from '~/style/commonStyle';
import { DEFAULT_TYPE } from '~/const';

import {
    ModalStyled,
    ReferenceWrapper,
    SpanStyled,
    StyledInputNumber,
    DescriptionWrapper,
    TextStyled,
    CounterWrapper,
    LabelStyled,
    IconStyled,
    FormStyled,
} from './ReturnCreationModal.styled';
import { DropDownButton } from '../../DropDownButton';
import { TooltipIconButton } from '../../TooltipIconButton';
import { useSelector } from 'react-redux';

interface ReturnCreationModalProps {
    close: () => void;
    order: OrderFull;
}

export const ReturnCreationModal: React.FC<ReturnCreationModalProps> = ({ close, order }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm<CommonReturnInfo>();
    const entity = Form.useWatch('entity', form);
    const type = Form.useWatch('type', form);
    const motives = Form.useWatch('motives', form);

    const { getBusinessUnits } = useActions(businessUnitsActions);
    const { getReturnReasons, createReturns } = useActions(returnsActions);

    const businessUnits = useSelector(selectOrdersBusinessUnits);
    const loading = useSelector(selectLoadingOrder);
    const orderLines = useSelector(selectOrderLinesForReturn);
    const returnReasons = useSelector(selectActiveReturnReasons);
    const returnTypes = useSelector(selectReturnTypes);

    const [orderToReturn, setOrderToReturn] = useState(orderLines);

    useEffect(() => {
        !businessUnits?.length && getBusinessUnits();
        !returnReasons?.length && getReturnReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getFieldsValue } = form;
    const motivesRule = [{ max: 200, message: t('modals.return_creation.text_limit_error') }];
    const mappedReturnReasons = returnReasons?.map(mapIdToValueOption);
    const mappedTypes = useMemo(
        () =>
            returnTypes?.map((returnType: string) => ({
                value: returnType,
                label: t(`type.OrderReturn.${returnType}`),
            })),
        [returnTypes, t],
    );

    const confirmCancellationReturnCreation = useCallback(() => {
        Alert.confirm({
            title: t('modals.cancel_return_creation.title'),
            content: t('modals.cancel_return_creation.content'),
            okText: t('common.yes_quit'),
            cancelText: t('common.go_back'),
            onOk: close,
        });
    }, [t, close]);

    const changeQuantity = useCallback((idOrderLine, value) => {
        setOrderToReturn(changeQuantityOrderLine({ idOrderLine, value }));
    }, []);

    const changeReason = useCallback((idOrderLine: string, option) => {
        setOrderToReturn(changeReasonOrderLine({ idOrderLine, option }));
    }, []);

    const changeQuantityItem = useCallback((idOrderLine: string, idItem: string, value) => {
        setOrderToReturn(changeQuantityItemLine({ idOrderLine, idItem, value }));
    }, []);

    const changeReasonItem = useCallback((idOrderLine: string, idItem: string, option) => {
        setOrderToReturn(changeReasonItemLine({ idOrderLine, idItem, option }));
    }, []);

    const addItem = (idOrderLine: string, quantity: number) => {
        setOrderToReturn(addItemLine({ idOrderLine }));
    };

    const deleteItem = (idOrderLine: string, idItem: string, quantity: number) => {
        setOrderToReturn(deleteItemLine({ idOrderLine, idItem }));
    };

    const handleReturnCreation = () => {
        const mappedReturn = mapReturns(getFieldsValue(), getItems(orderToReturn));
        createReturns({ idOrder: order.id, body: mappedReturn, navigate });
        close();
    };

    const columnsOrderLine: ColumnProps<OrderLinesToReturn>[] = [
        {
            title: <LabelStyled>{t('common.product')}</LabelStyled>,
            key: 'label',
            width: 220,
            render: (orderLine) =>
                orderLine.isItem ? (
                    <>
                        <Tag color="success">{t('common.added').toUpperCase()}</Tag>
                        <LabelStyled>{orderLine.label}</LabelStyled>
                    </>
                ) : (
                    <LabelStyled>{orderLine.label}</LabelStyled>
                ),
        },
        {
            title: (
                <Tooltip placement="top" title={t('modals.return_creation.reason_tooltip')}>
                    {t('modals.return_creation.table.return_reason')}
                    <IconStyled name="help" size="sm" />
                </Tooltip>
            ),
            key: 'returnReason',
            width: 230,
            render: (orderLine) => {
                if (orderLine.isItem) {
                    return (
                        <Select
                            options={mappedReturnReasons}
                            placeholder={t('modals.return_creation.select_reason')}
                            onChange={(_, option) => changeReasonItem(orderLine.order_line_id, orderLine.id, option)}
                            defaultValue={orderLine.reason_type}
                            showArrow
                        />
                    );
                }
                if (orderLine.quantityLeft) {
                    return (
                        <Select
                            options={mappedReturnReasons}
                            placeholder={t('modals.return_creation.select_reason')}
                            onChange={(_, option) => changeReason(orderLine.id, option)}
                            defaultValue={orderLine.reason_type}
                            showArrow
                        />
                    );
                }
                return null;
            },
        },
        {
            title: t('modals.return_creation.table.quantity_left'),
            dataIndex: 'quantityLeft',
            key: 'quantityLeft',
            align: 'center',
            width: 150,
        },
        {
            title: t('modals.return_creation.table.quantity_to_return'),
            key: 'quantityToReturn',
            align: 'center',
            width: 200,
            render: (orderLine) => {
                if (orderLine.isItem) {
                    const parentOrderLine = orderToReturn[orderLine.order_line_id];
                    return (
                        <StyledInputNumber
                            min={1}
                            max={!parentOrderLine.quantityLeft && orderLine.quantityToReturn}
                            value={orderLine.quantityToReturn}
                            onChange={(value) => changeQuantityItem(orderLine.order_line_id, orderLine.id, value)}
                        />
                    );
                }
                if (orderLine.quantityLeft) {
                    return (
                        <StyledInputNumber
                            min={0}
                            max={orderLine.quantityLeft}
                            value={orderLine.quantityToReturn}
                            onChange={(value) => changeQuantity(orderLine.id, value)}
                        />
                    );
                }
                return orderLine.maxQuantityLeft;
            },
        },
        {
            key: 'action',
            align: 'center',
            width: 90,
            render: (orderLine) => {
                if (orderLine.isItem) {
                    return (
                        <TooltipIconButton
                            iconName="delete"
                            title={t('modals.return_creation.delete_return')}
                            onClick={() =>
                                deleteItem(orderLine.order_line_id, orderLine.id, orderLine.quantityToReturn)
                            }
                        />
                    );
                }
                if (orderLine.quantityLeft) {
                    return (
                        <TooltipIconButton
                            iconName="add-circle"
                            title={t('modals.return_creation.add_return')}
                            disabled={
                                orderLine.quantityToReturn > orderLine.quantityLeft ||
                                !orderLine.quantityToReturn ||
                                !orderLine.reason_type
                            }
                            onClick={() => addItem(orderLine.id, orderLine.quantityToReturn)}
                        />
                    );
                }
                return null;
            },
        },
    ];

    const arrOrders = useMemo(() => Object.values(orderToReturn), [orderToReturn]);
    const counter = useMemo(() => sumItemsToReturn(arrOrders), [arrOrders]);

    return (
        <ModalStyled
            onCancel={confirmCancellationReturnCreation}
            onOk={handleReturnCreation}
            title={
                <>
                    <SpanStyled>{t('modals.return_creation.title')}</SpanStyled>
                    <ReferenceWrapper> {showReference(order?.reference)}</ReferenceWrapper>
                </>
            }
            visible
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            okButtonProps={{ disabled: !counter || !entity || !type || (!!motives && motives.length > 200) }}
            cancelButtonProps={{ type: 'link' }}
        >
            <FormStyled form={form} layout="vertical">
                <SelectFilter
                    name="entity"
                    label={`${t('modals.return_creation.return_to')}*`}
                    options={businessUnits?.map(mapIdToValueOption)}
                    placeholder={t('modals.return_creation.select_entity')}
                    optionFilterProp="label"
                    showSearch
                />

                <SelectFilter
                    name="type"
                    label={`${t('common.type')}*`}
                    options={mappedTypes}
                    defaultValue={DEFAULT_TYPE}
                    placeholder={t('modals.return_creation.select_type')}
                    tooltip={t('modals.return_creation.type_tooltip')}
                />

                <Form.Item
                    name="motives"
                    label={t('common.motives')}
                    rules={motivesRule}
                    tooltip={t('modals.return_creation.motives_tooltip')}
                >
                    <Input placeholder={t('common.enter')} />
                </Form.Item>
            </FormStyled>
            <DescriptionWrapper>
                <Typography.Text>{t('modals.return_creation.add_products_to_return')}</Typography.Text>
                <CounterWrapper>
                    <TextStyled>{t('modals.return_creation.items_to_return')}</TextStyled>
                    <Counter>{counter}</Counter>
                </CounterWrapper>
            </DescriptionWrapper>
            <Table
                rowKey="id"
                dataSource={arrOrders}
                locale={{ emptyText: t('modals.return_creation.empty_text') }}
                columns={columnsOrderLine}
                loading={loading}
                pagination={false}
                defaultExpandAllRows={true}
                expandIcon={DropDownButton}
                childrenColumnName="items"
                scroll={{ y: 320 }}
            />
        </ModalStyled>
    );
};
