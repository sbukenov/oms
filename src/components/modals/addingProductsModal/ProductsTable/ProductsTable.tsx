import Tooltip from 'antd/lib/tooltip';
import { Icon } from '@-bo/component-library';
import React, { useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import {
    DEFAULT_CURRENCY,
    formatPrice,
    getSelectedEntity,
    mapIdToValueOption,
    useColumnConfiguration,
    showPriceWithCurrency,
    getPrice,
} from '@-bo/utils';
import { EmptyImage, Pagination } from '@-bo/keystone-components';

import type { ProductsTableDefaultColumns, Product, Packaging } from '~/models';
import { SHORT_CONFIG_COLUMN__PRODUCT_LIST, CONFIG_COLUMN__PRODUCT_LIST, QA_PRODUCTS_TABLE } from '~/const';
import { DEFAULT_DASH } from '~/const/configuration/common';
import { getModuleContext } from '~/utils/context';
import { selectProducts } from '~/redux/selectors';
import { productsActions } from '~/redux/slices';
import { ImageStyled, TableThinStyled } from '~/style/commonStyle';
import { useActions } from '~/hooks';

import { Wrapper, SelectStyled } from './ProductsTable.styled';

interface ProductsTableProps {
    selectedRowKeys: React.Key[];
    setSelectedRowKeys: (keys: React.Key[]) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ selectedRowKeys, setSelectedRowKeys }) => {
    const { t, i18n } = useTranslation();
    const { loading, products, next, prev } = useSelector(selectProducts);
    const { loadProductsNextPage, loadProductsPrevPage, setPackagingIsChosen } = useActions(productsActions);
    const { config } = useContext(getModuleContext());
    const currency = getSelectedEntity()?.currency.iso_code || DEFAULT_CURRENCY;

    const columnsConfiguration = config?.specific?.orderCreation?.productsTable ?? SHORT_CONFIG_COLUMN__PRODUCT_LIST;

    const defaultColumnsToProps: { [key in ProductsTableDefaultColumns]?: ColumnProps<Product> } = useMemo(
        () => ({
            IMAGE: {
                dataIndex: ['product', 'image_url'],
                width: 80,
                render: (url: Product['product']['image_url']) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
            },
            BOX_SIZE: {
                width: 232,
                title: t('order_creation.product_table.box_size'),
                render: ({ packagings, product }: Product) => {
                    if (!packagings.length) return DEFAULT_DASH;
                    if (packagings.length === 1) return packagings[0].label;

                    const options = packagings.map(mapIdToValueOption);

                    return (
                        <SelectStyled
                            defaultValue={options[0].label}
                            onChange={(packagingId) => {
                                setPackagingIsChosen({ packagingId, productUuid: product.pim_uuid });
                            }}
                            options={options}
                        />
                    );
                },
            },
            PACKAGING_REF: {
                dataIndex: 'packagings',
                title: t('order_creation.product_table.packaging_ref'),
                render: (packaging: Packaging[]) => {
                    if (!packaging.length) return DEFAULT_DASH;

                    const selectedPackaging = packaging.find(({ isChosen }) => isChosen);
                    return selectedPackaging?.reference || DEFAULT_DASH;
                },
            },
            OUTER: {
                dataIndex: 'packagings',
                title: t('order_creation.product_table.outer'),
                render: (packaging: Packaging[]) => {
                    if (!packaging.length) return DEFAULT_DASH;

                    const selectedPackaging = packaging.find(({ isChosen }) => isChosen);
                    return selectedPackaging?.product_per_packaging || DEFAULT_DASH;
                },
            },
            PRICE_PER_UNIT: {
                dataIndex: 'packagings',
                title: t('order_creation.product_table.price_per_unit'),
                render: (packaging: Packaging[]) => {
                    if (!packaging.length) return DEFAULT_DASH;

                    const selectedPackaging = packaging.find(({ isChosen }) => isChosen);
                    const productPerPackaging = selectedPackaging?.product_per_packaging;
                    return productPerPackaging
                        ? showPriceWithCurrency(
                              getPrice(selectedPackaging?.price?.amount) / productPerPackaging,
                              undefined,
                              i18n.resolvedLanguage,
                          )
                        : DEFAULT_DASH;
                },
            },
            MIN_QUANTITY: {
                dataIndex: 'packagings',
                title: (
                    <div>
                        {t('order_creation.product_table.min_quantity')}
                        <Tooltip title={t('order_creation.min_quantity_allowed')} placement="bottom">
                            {' '}
                            <Icon name="information" size="sm" />
                        </Tooltip>
                    </div>
                ),
                render: (packaging: Packaging[]) => {
                    if (!packaging.length) return DEFAULT_DASH;

                    const selectedPackaging = packaging.find(({ isChosen }) => isChosen);
                    return selectedPackaging?.min_quantity || 1;
                },
            },
            MIN_PRICE: {
                dataIndex: 'packagings',
                title: t('order_creation.product_table.min_price'),
                render: (packaging: Packaging[]) => {
                    if (!packaging.length) return DEFAULT_DASH;

                    const selectedPackaging = packaging.find(({ isChosen }) => isChosen);
                    return selectedPackaging?.price?.amount
                        ? formatPrice(selectedPackaging.price.amount, currency)
                        : DEFAULT_DASH;
                },
            },
        }),
        [currency, i18n.resolvedLanguage, setPackagingIsChosen, t],
    );

    const columns: ColumnProps<Product>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__PRODUCT_LIST,
        defaultColumnsToProps,
        QA_PRODUCTS_TABLE,
    );

    const onSelectChange = (newRowKeys: React.Key[]) => {
        setSelectedRowKeys(newRowKeys);
    };

    const clearSelections = useCallback(() => {
        setSelectedRowKeys([]);
    }, [setSelectedRowKeys]);

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true,
        selections: [
            {
                key: 'clear-all',
                text: t('common.clear_selection'),
                onSelect: clearSelections,
            },
        ],
    };

    const locale = {
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} />,
    };

    return (
        <Wrapper>
            <TableThinStyled
                rowKey={(record) => record.product.pim_uuid}
                rowSelection={rowSelection}
                dataSource={products}
                loading={loading}
                columns={columns}
                locale={locale}
                pagination={false}
            />
            <Pagination
                loading={loading}
                loadNextPage={loadProductsNextPage}
                loadPrevPage={loadProductsPrevPage}
                next={next}
                prev={prev}
            />
        </Wrapper>
    );
};
