import { DEFAULT_CURRENCY, formatPrice, getSelectedEntity } from '@bo/utils';
import Select from 'antd/lib/select';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { DEFAULT_DASH } from '~/const';
import { selectPackagingsList, selectPackagingsLoading, selectPackagingsNext } from '~/redux/selectors';
import { useActions } from '~/hooks';
import { orderCreationActions, packagingsActions } from '~/redux/slices';
import { ImageStyled } from '~/style/commonStyle';
import { mapPackagingToProduct } from '~/utils';

import {
    dropdownAlignFixed,
    ProductColumns,
    ProductOption,
    ScrollableContainer,
    SpanStyled,
} from './ProductsSearch.styled';

export const ProductsSearch: React.FC = () => {
    const { t } = useTranslation();
    const packagings = useSelector(selectPackagingsList);
    const isLoading = useSelector(selectPackagingsLoading);
    const next = useSelector(selectPackagingsNext);
    const { loadPackagings, searchPackagings, resetPackagings } = useActions(packagingsActions);
    const { addProduct } = useActions(orderCreationActions);
    const currency = getSelectedEntity()?.currency.iso_code || DEFAULT_CURRENCY;
    const dataLength = packagings?.length ?? 0;

    const onSelect = useCallback(
        (_, option) => {
            addProduct(mapPackagingToProduct(option.packaging));
            resetPackagings();
        },
        [addProduct, resetPackagings],
    );

    return (
        <Select
            placeholder={t('common.search_by')}
            filterOption={false}
            virtual={false}
            showSearch
            value={[]}
            showArrow={false}
            onSearch={searchPackagings}
            loading={isLoading}
            onSelect={onSelect}
            placement="bottomLeft"
            allowClear
            onClear={resetPackagings}
            dropdownAlign={dropdownAlignFixed}
            dropdownRender={(menu) => {
                return (
                    <ScrollableContainer isHeightFixed={dataLength >= 10} id="scrollableDiv">
                        {!!dataLength && (
                            <ProductColumns>
                                <span className="col-product-label">{t('common.product')}</span>
                                <span>{t('common.barcode')}</span>
                                <span>{t('order_creation.product_table.box_size')}</span>
                                <span>{t('order_creation.product_table.packaging_ref')}</span>
                                <SpanStyled>{t('order_creation.product_table.outer')}</SpanStyled>
                                <span>{t('order_creation.product_table.min_quantity')}</span>
                                <SpanStyled>{t('order_creation.product_table.min_price')}</SpanStyled>
                            </ProductColumns>
                        )}
                        <InfiniteScroll
                            dataLength={dataLength}
                            next={loadPackagings}
                            loader={<span>{t('common.loading')}</span>}
                            hasMore={!!next}
                            scrollableTarget="scrollableDiv"
                        >
                            {menu}
                        </InfiniteScroll>
                    </ScrollableContainer>
                );
            }}
        >
            {packagings.map((packaging) => {
                return (
                    <Select.Option key={packaging.id} value={packaging.id} packaging={packaging}>
                        <ProductOption>
                            <span title={packaging.packaging_product?.label}>
                                <ImageStyled
                                    src={packaging.packaging_product?.image_url}
                                    $height={32}
                                    $width={32}
                                    $borderRadius="4px"
                                />
                                {packaging.packaging_product?.label}
                            </span>
                            <span>{packaging.packaging_product?.barcode}</span>
                            <span title={packaging.label}>{packaging.label}</span>
                            <span title={packaging.reference || ''}>{packaging.reference}</span>
                            <SpanStyled>{packaging.product_per_packaging}</SpanStyled>
                            <span>{packaging.min_quantity}</span>
                            <SpanStyled>
                                {packaging.price?.amount ? formatPrice(packaging.price.amount, currency) : DEFAULT_DASH}
                            </SpanStyled>
                        </ProductOption>
                    </Select.Option>
                );
            })}
        </Select>
    );
};
