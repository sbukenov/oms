import { SearchInput, StyledFormItem } from '@bo/keystone-components';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useActions } from '~/hooks';
import { productsActions } from '~/redux/slices';
import { ProductsTable } from '../ProductsTable';

import { StyledModal } from './AddingProductsModal.styled';

interface AddingProductsModalProps {
    supplier?: string;
    close: () => void;
    addProductKeys: (keys: React.Key[]) => void;
}

export const AddingProductsModal: FC<AddingProductsModalProps> = ({ supplier, close, addProductKeys }) => {
    const { t } = useTranslation();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [search, setSearch] = useState('');

    const { loadProducts, resetProducts, searchProducts } = useActions(productsActions);

    useEffect(() => {
        loadProducts({ supplier });
        return () => {
            resetProducts();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdding = useCallback(() => {
        addProductKeys(selectedRowKeys);
        close();
    }, [addProductKeys, close, selectedRowKeys]);

    const handleSearch = useCallback(
        (value) => {
            searchProducts({ search: value, supplier });
        },
        [searchProducts, supplier],
    );

    return (
        <StyledModal
            visible
            title={t('modals.add_products.title')}
            onCancel={close}
            cancelText={t('common.cancel')}
            cancelButtonProps={{ type: 'link' }}
            okText={t('common.add')}
            onOk={handleAdding}
            okButtonProps={{ disabled: !selectedRowKeys.length }}
        >
            <StyledFormItem label={t('common.search')}>
                <SearchInput
                    value={search}
                    placeholder={t('modals.add_products.search_by_product')}
                    updateSearchValue={setSearch}
                    handleSearch={handleSearch}
                />
            </StyledFormItem>
            <ProductsTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
        </StyledModal>
    );
};
