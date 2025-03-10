import Tooltip from 'antd/lib/tooltip';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ColumnProps } from 'antd/lib/table';
import Empty from 'antd/lib/empty';
import Button from 'antd/lib/button';
import { Icon, Color } from '@-bo/component-library';
import { useColumnConfiguration, showPriceWithCurrency, getPrice } from '@-bo/utils';
import { EmptyImage } from '@-bo/keystone-components';

import type { CreationTableDefaultColumns, Product } from '~/models';
import { SHORT_CONFIG_COLUMN__CREATION_LIST, CONFIG_COLUMN__CREATION_LIST, QA_PRODUCTS_CREATION_TABLE } from '~/const';
import { DEFAULT_DASH } from '~/const/configuration/common';
import { getModuleContext } from '~/utils/context';
import { getSelectedProducts } from '~/redux/selectors';
import { orderCreationActions } from '~/redux/slices';
import { ImageStyled } from '~/style/commonStyle';
import { getUuidIdProduct } from '~/utils';
import { useActions } from '~/hooks';

import { TableStyled, Wrapper, StyledInputNumber } from './ProductsCreationTable.styled';
import { ProductsCreationTableFooter } from '../ProductsCreationTableFooter';

export interface ProductsCreationTableProps {
    disabled?: boolean;
}

export const ProductsCreationTable: FC<ProductsCreationTableProps> = ({ disabled }) => {
    const { t, i18n } = useTranslation();
    const products = useSelector(getSelectedProducts);
    const { deleteProduct, changeProductQuantity } = useActions(orderCreationActions);
    const { config } = useContext(getModuleContext());

    const columnsConfiguration = config?.specific?.orderCreation?.table ?? SHORT_CONFIG_COLUMN__CREATION_LIST;

    const defaultColumnsToProps: { [key in CreationTableDefaultColumns]?: ColumnProps<Product> } = useMemo(
        () => ({
            IMAGE: {
                dataIndex: ['product', 'image_url'],
                width: 80,
                render: (url: Product['product']['image_url']) => (url ? <ImageStyled src={url} /> : <EmptyImage />),
            },
            QUANTITY: {
                title: t('order_creation.product_table.quantity'),
                render: (product: Product) => {
                    let tooltipTitle;
                    if (
                        product.selectedPackaging?.min_quantity &&
                        product.selectedPackaging.min_quantity === product.quantity
                    ) {
                        tooltipTitle = t('errors.not_allowed_quantity', {
                            min_quantity: product.selectedPackaging.min_quantity,
                        });
                    }
                    return (
                        <Tooltip title={tooltipTitle}>
                            <StyledInputNumber
                                type="number"
                                onChange={(quantity: number) => {
                                    changeProductQuantity({
                                        uuid: getUuidIdProduct(product),
                                        quantity,
                                        price: product.selectedPackaging?.price,
                                    });
                                }}
                                min={product.selectedPackaging?.min_quantity || 1}
                                value={product.quantity}
                            />
                        </Tooltip>
                    );
                },
            },
            TOTAL_OUTER: {
                title: t('order_creation.product_table.total_quantity'),
                render: ({ selectedPackaging, quantity }: Product) =>
                    !selectedPackaging ? DEFAULT_DASH : selectedPackaging?.product_per_packaging * quantity!,
            },
            PRICE_PER_UNIT: {
                title: t('order_creation.product_table.price_per_unit'),
                render: ({ selectedPackaging, unit_price_excluding_vat }: Product) => {
                    const productPerPackaging = selectedPackaging?.product_per_packaging;
                    return productPerPackaging
                        ? showPriceWithCurrency(
                              getPrice(unit_price_excluding_vat) / productPerPackaging,
                              undefined,
                              i18n.resolvedLanguage,
                          )
                        : DEFAULT_DASH;
                },
            },
            TRASH: {
                width: 48,
                render: (product: Product) => (
                    <Button
                        type="link"
                        onClick={() => {
                            deleteProduct(getUuidIdProduct(product));
                        }}
                    >
                        <Icon name="trash" size="sm" color={Color.neutral(6)} />
                    </Button>
                ),
            },
        }),
        [changeProductQuantity, deleteProduct, i18n.resolvedLanguage, t],
    );

    const columns: ColumnProps<Product>[] = useColumnConfiguration(
        columnsConfiguration,
        undefined,
        CONFIG_COLUMN__CREATION_LIST,
        defaultColumnsToProps,
        QA_PRODUCTS_CREATION_TABLE,
    );

    const locale = {
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common.no_data')} />,
    };

    const createFooter = useCallback(() => {
        return <ProductsCreationTableFooter />;
    }, []);

    if (!products.length) return null;

    return (
        <Wrapper data-disabled={disabled}>
            <TableStyled
                rowKey={(product) => getUuidIdProduct(product)}
                dataSource={products}
                columns={columns}
                locale={locale}
                footer={createFooter}
            />
        </Wrapper>
    );
};
