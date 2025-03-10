import { Icon, Color } from '@bo/component-library';
import { EmptyImage } from '@-bo/keystone-components';
import {
    DEFAULT_CURRENCY,
    formatPrice,
    getRawAmountValue,
    getSelectedEntity,
    Price,
    showPriceWithCurrency,
    useColumnConfiguration,
} from '@-bo/utils';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import type { ColumnProps, TableProps } from 'antd/lib/table';
import React, { FC, useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'antd/lib/table';

import {
    SHORT_CONFIG_COLUMN__EXPEDITION_LIST,
    CONFIG_COLUMN__EXPEDITION_LIST,
    DEFAULT_DASH,
    QA_RECEPTION_DETAILS_TABLE,
    UNEXPECTED_TYPE,
} from '~/const';
import type {
    LogisticUnit,
    UnexpectedLogisticUnit,
    ReceptionDetailsTableDefaultColumns,
    ReceptionQuantitiesById,
    ReplenishmentOperation,
} from '~/models';
import { ButtonBoldStyled, ImageStyled, TableFooter } from '~/style/commonStyle';
import { getModuleContext, getReceptionMax } from '~/utils';

import { StyledInputNumber, TableStyled } from './ReceptionCreationTable.styled';
import { ReceptionCreationFooter } from '../../OrderDetails';

interface ReceptionDetailsTableProps {
    selectedRowKeys: React.Key[];
    setSelectedRowKeys: (values: React.Key[]) => void;
    quantitiesById: ReceptionQuantitiesById;
    setQuantitiesById: (values: ReceptionQuantitiesById) => void;
    showModal: () => void;
    reception: ReplenishmentOperation | undefined;
    dataSource?: (LogisticUnit | UnexpectedLogisticUnit)[];
    deleteReceptionProduct: (key: string) => void;
}

export const ReceptionCreationTable: FC<ReceptionDetailsTableProps> = ({
    selectedRowKeys,
    setSelectedRowKeys,
    quantitiesById,
    setQuantitiesById,
    showModal,
    reception,
    dataSource,
    deleteReceptionProduct,
}) => {
    const {
        t,
        i18n: { resolvedLanguage },
    } = useTranslation();
    const { config } = useContext(getModuleContext());
    const currency = getSelectedEntity()?.currency.iso_code || DEFAULT_CURRENCY;
    const columnsConfiguration = config.specific?.receptionDetails?.table || SHORT_CONFIG_COLUMN__EXPEDITION_LIST;

    const defaultColumnsToProps: {
        [key in ReceptionDetailsTableDefaultColumns]?: ColumnProps<LogisticUnit>;
    } = useMemo(
        () => ({
            IMAGE: {
                dataIndex: ['logistic_unit_items', '0', 'image_url'],
                width: 80,
                render: (url: string) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
            },
            RECEIVED: {
                title: t('reception_details.received'),
                width: 112,
                render: (record: LogisticUnit | UnexpectedLogisticUnit) => {
                    const initialQuantitiy = record.packaging.quantity || 0;

                    if (quantitiesById.hasOwnProperty(record.id)) {
                        return (
                            <StyledInputNumber
                                type="number"
                                size="middle"
                                min={0}
                                max={getReceptionMax(quantitiesById[record.id], initialQuantitiy, 'received')}
                                value={quantitiesById[record.id].received}
                                onChange={(value) => {
                                    setQuantitiesById({
                                        ...quantitiesById,
                                        [record.id]: { ...quantitiesById[record.id], received: Number(value) },
                                    });
                                }}
                            />
                        );
                    }
                    return <span>{initialQuantitiy}</span>;
                },
            },
            DAMAGED: {
                title: t('reception_details.damaged'),
                width: 112,
                render: (record: LogisticUnit) => {
                    const initialQuantitiy = record.packaging.quantity;
                    if (quantitiesById.hasOwnProperty(record.id)) {
                        return (
                            <StyledInputNumber
                                type="number"
                                size="middle"
                                min={0}
                                max={getReceptionMax(quantitiesById[record.id], initialQuantitiy, 'damaged')}
                                value={quantitiesById[record.id].damaged}
                                onChange={(value) => {
                                    setQuantitiesById({
                                        ...quantitiesById,
                                        [record.id]: { ...quantitiesById[record.id], damaged: Number(value) },
                                    });
                                }}
                            />
                        );
                    }

                    return <span>{0}</span>;
                },
            },
            MISSING: {
                title: t('reception_details.missing'),
                width: 112,
                render: (record: LogisticUnit) => {
                    const initialQuantitiy = record.packaging.quantity;

                    if (quantitiesById.hasOwnProperty(record.id)) {
                        return (
                            <StyledInputNumber
                                type="number"
                                size="middle"
                                min={0}
                                max={getReceptionMax(quantitiesById[record.id], initialQuantitiy, 'missing')}
                                value={quantitiesById[record.id].missing}
                                onChange={(value) => {
                                    setQuantitiesById({
                                        ...quantitiesById,
                                        [record.id]: { ...quantitiesById[record.id], missing: Number(value) },
                                    });
                                }}
                            />
                        );
                    }

                    return <span>{0}</span>;
                },
            },
            UNIT_PRICE: {
                title: t('reception_details.unit_price'),
                render: (record: LogisticUnit | UnexpectedLogisticUnit) => {
                    if ('isUnexpected' in record) {
                        if (quantitiesById.hasOwnProperty(record.id)) {
                            const onChange = (value: number) => {
                                setQuantitiesById({
                                    ...quantitiesById,
                                    [record.id]: {
                                        ...quantitiesById[record.id],
                                        price: value,
                                    },
                                });
                            };
                            return (
                                <StyledInputNumber
                                    min={0}
                                    value={quantitiesById[record.id].price as number}
                                    precision={2}
                                    onChange={onChange}
                                />
                            );
                        }

                        return record?.price
                            ? showPriceWithCurrency(record.price, currency, resolvedLanguage)
                            : DEFAULT_DASH;
                    }
                    if (!record?.price) return DEFAULT_DASH;

                    return formatPrice(record.price, currency, resolvedLanguage);
                },
            },
            TOTAL_AMOUNT: {
                title: t('reception_details.total_amount'),
                dataIndex: 'initial_total_amount',
                render: (price: Price) => {
                    if (!price) return DEFAULT_DASH;
                    return formatPrice(price, currency, resolvedLanguage);
                },
            },
            TOTAL_RECEIVED_AMOUNT: {
                title: t('reception_details.total_received_amount'),
                render: (record: LogisticUnit) => {
                    if (!record?.price) return DEFAULT_DASH;
                    if (quantitiesById.hasOwnProperty(record.id)) {
                        const selectedUnit = quantitiesById[record.id];
                        const price =
                            typeof selectedUnit.price === 'number'
                                ? selectedUnit.price
                                : getRawAmountValue(selectedUnit.price);

                        return (price * quantitiesById[record.id].received).toLocaleString(resolvedLanguage, {
                            style: 'currency',
                            currency,
                        });
                    }
                    if (!record.initial_total_amount) return DEFAULT_DASH;
                    return formatPrice(record.initial_total_amount, currency, resolvedLanguage);
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
                                deleteReceptionProduct(record.id);
                            }}
                        >
                            <Icon name="trash" size="sm" color={Color.neutral(6)} />
                        </Button>
                    );
                },
            },
        }),
        [currency, deleteReceptionProduct, quantitiesById, resolvedLanguage, setQuantitiesById, t],
    );

    const columns: ColumnProps<LogisticUnit | UnexpectedLogisticUnit>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__EXPEDITION_LIST,
        defaultColumnsToProps,
        QA_RECEPTION_DETAILS_TABLE,
    );

    const locale = { emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} /> };

    const rowSelection = useMemo<TableProps<LogisticUnit | UnexpectedLogisticUnit>['rowSelection']>(
        () => ({
            selectedRowKeys,
            onChange: (keys, rows) => {
                setSelectedRowKeys(keys);
                setQuantitiesById(
                    rows.reduce((acc: ReceptionQuantitiesById, item) => {
                        const quantity = item.packaging.quantity || 0;

                        if (quantitiesById[item.id]) {
                            acc[item.id] = quantitiesById[item.id];
                        } else {
                            acc[item.id] = {
                                type: item.type,
                                received: quantity,
                                damaged: 0,
                                missing: 0,
                                packaging: item.packaging,
                                logistic_unit_items: item.logistic_unit_items,
                                price: item.price,
                            };
                        }
                        return acc;
                    }, {}),
                );
            },
        }),
        [quantitiesById, selectedRowKeys, setQuantitiesById, setSelectedRowKeys],
    );

    const rowClassName = useCallback(
        (record: LogisticUnit | UnexpectedLogisticUnit) => {
            const initialQuantitiy = record.packaging.quantity;
            if (quantitiesById[record.id] && quantitiesById[record.id].received < initialQuantitiy) {
                return 'red';
            }
            return '';
        },
        [quantitiesById],
    );

    return (
        <TableStyled
            rowKey="id"
            columns={columns}
            locale={locale}
            dataSource={dataSource}
            pagination={false}
            rowSelection={rowSelection}
            rowClassName={rowClassName}
            summary={() => (
                <Table.Summary fixed>
                    <ReceptionCreationFooter
                        parentColumns={columnsConfiguration}
                        quantitiesById={quantitiesById}
                        reception={reception}
                        currency={currency}
                        dataSource={dataSource}
                    />
                </Table.Summary>
            )}
            footer={() => (
                <TableFooter>
                    <ButtonBoldStyled icon={<Icon name="add" size="sm" />} type="link" onClick={showModal}>
                        {t('reception_details.add_unexpected_item')}
                    </ButtonBoldStyled>
                </TableFooter>
            )}
        />
    );
};
