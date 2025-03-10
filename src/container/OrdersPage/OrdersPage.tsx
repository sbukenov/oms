import React, { useEffect, useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePrivileges, KeyParam } from '@-bo/utils';
import {
    CustomActions,
    Pagination,
    SearchInput,
    StyledSpace,
    TabFilter,
    Tabs,
    FilterDrawer,
    FlexEndBlock,
} from '@-bo/keystone-components';

import {
    DEFAULT_FILTER_TABS,
    ROUTE_ORDERS,
    ALL_TAB,
    ROUTE_NO_ACCESS,
    PRIVILEGE_ORDER_LIST,
    QA_ORDER_TAB,
    DEFAULT_FILTER__ORDER_LIST,
} from '~/const';
import { useActions, useFilter, useActionListData } from '~/hooks';
import { countAppliedFilters, selectOrdersFilters, selectOrderSearch, selectOrdersListData } from '~/redux/selectors';
import { ordersActions, refreshActionsMap } from '~/redux/slices';
import { getModuleContext } from '~/utils';
import { EmptyState } from '~/components';
import type { OrdersTableColumn, StatusGroups, GetStatusesResponse } from '~/models';
import { ControlRow, Spacer } from '~/style/commonStyle';

import { OrdersTable } from './OrdersTable';

export const OrdersPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { key: selectedTabKey } = useParams<KeyParam>();
    const { config, baseRoute } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const value = useSelector(selectOrderSearch);
    const { data, loading, next, prev } = useSelector(selectOrdersListData);
    const appliedFilters = useSelector(countAppliedFilters);
    const search = useSelector(selectOrderSearch);
    const filters = useSelector(selectOrdersFilters);
    const { loadOrders, resetOrders, loadNextPage, loadPrevPage, updateSearch, searchOrders, updateFilters } =
        useActions(ordersActions);
    const { mapSpecialOptions, getSpecialFilter } = useFilter(t);
    const actionsData = useActionListData({ filters, search, list: data.orders });

    const tabsConfig: TabFilter<OrdersTableColumn, StatusGroups, GetStatusesResponse>[] = useMemo(
        () => config.specific?.orders?.tabs || DEFAULT_FILTER_TABS,
        [config],
    );
    const selectedTab = useMemo(
        () => tabsConfig.find(({ key }) => key === selectedTabKey),
        [selectedTabKey, tabsConfig],
    );

    const selectedTabActions = selectedTab?.actions || config?.specific?.orders?.actions;

    const filterGroups =
        selectedTab?.filters?.filterGroups ||
        config?.specific?.orders?.filters?.filterGroups ||
        DEFAULT_FILTER__ORDER_LIST.filterGroups;

    const updateSearchValue = useCallback(
        (search: string) => {
            updateSearch({ route: selectedTab?.url, search });
        },
        [selectedTab?.url, updateSearch],
    );

    const handleSearch = useCallback(() => {
        searchOrders({ filterTabConfig: selectedTab?.filters });
    }, [searchOrders, selectedTab?.filters]);

    useEffect(() => {
        // reload and pass empty object to clear state
        navigate(pathname, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOrders = useCallback(() => {
        !!selectedTab?.url && loadOrders({ route: selectedTab.url, filterTabConfig: selectedTab.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadOrders, selectedTab?.url]);

    useEffect(() => {
        !selectedTab &&
            tabsConfig[0] &&
            navigate([`/${baseRoute}`, ROUTE_ORDERS, tabsConfig[0].key].join('/'), { state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseRoute, state, navigate, selectedTab?.url, tabsConfig]);

    useEffect(() => {
        if (!privileges?.size) return;
        if (!privileges.has(PRIVILEGE_ORDER_LIST)) {
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            return;
        }
        // @ts-ignore
        !state?.noRefresh && getOrders();
    }, [privileges, navigate, baseRoute, getOrders, state]);

    useEffect(() => {
        return () => {
            resetOrders();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowEmptyScreen =
        selectedTabKey === ALL_TAB && !data?.orders?.length && !loading && !value && !appliedFilters;

    return (
        <StyledSpace>
            {tabsConfig.length > 1 && (
                <Tabs
                    tabsConfig={tabsConfig}
                    route={ROUTE_ORDERS}
                    onChangeTab={resetOrders}
                    className={QA_ORDER_TAB}
                    baseRoute={baseRoute}
                    resolvedLanguage={i18n.resolvedLanguage}
                />
            )}
            {shouldShowEmptyScreen || !selectedTab ? (
                <>
                    {!!selectedTabActions && (
                        <FlexEndBlock>
                            <CustomActions
                                actionsConfig={selectedTabActions}
                                refreshActionsMap={refreshActionsMap}
                                data={actionsData}
                                t={t}
                            />
                        </FlexEndBlock>
                    )}
                    <EmptyState title={t('orders.empty.title')} subtitle={t('orders.empty.subtitle')} />
                </>
            ) : (
                <>
                    <ControlRow align="start" size={16}>
                        <SearchInput
                            updateSearchValue={updateSearchValue}
                            handleSearch={handleSearch}
                            value={value}
                            placeholder={t('orders.search.placeholder')}
                        />
                        <FilterDrawer
                            t={t}
                            data={actionsData}
                            filters={filters}
                            countFilters={appliedFilters}
                            filterGroups={filterGroups}
                            updateFilter={updateFilters}
                            applyFilter={getOrders}
                            mapSpecialOptions={mapSpecialOptions}
                            getSpecialFilter={getSpecialFilter}
                        />
                        <Spacer />
                        {!!selectedTabActions && (
                            <CustomActions
                                actionsConfig={selectedTabActions}
                                refreshActionsMap={refreshActionsMap}
                                data={actionsData}
                                t={t}
                            />
                        )}
                    </ControlRow>
                    <OrdersTable orders={data.orders} loading={loading} specialTabTable={selectedTab.table} />
                    <Pagination
                        loading={loading}
                        loadNextPage={loadNextPage}
                        loadPrevPage={loadPrevPage}
                        next={next}
                        prev={prev}
                    />
                </>
            )}
        </StyledSpace>
    );
};
