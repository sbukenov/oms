import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
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
import { usePrivileges, KeyParam } from '@-bo/utils';

import { useActions, useFilter, useActionListData } from '~/hooks';
import { selectTransactionsTable, countTransactionsAppliedFilters } from '~/redux/selectors';
import { refreshActionsMap, transactionsActions } from '~/redux/slices';
import {
    DEFAULT_FILTER_TABS__TRANSACTIONS,
    ROUTE_TRANSACTIONS,
    ALL_TAB,
    ROUTE_NO_ACCESS,
    PRIVILEGE_TRANSACTION_LIST,
    QA_ORDER_TAB,
    DEFAULT_FILTER__TRANSACTION_LIST,
} from '~/const';
import type { TransactionsTableColumn, StatusGroups, GetStatusesResponse } from '~/models';
import { getModuleContext } from '~/utils';
import { EmptyState } from '~/components';
import { ControlRow, Spacer } from '~/style/commonStyle';

import { TransactionsTable } from './TransactionsTable';

export const Transactions: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { key: selectedTabKey } = useParams<KeyParam>();
    const { baseRoute, config } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const {
        transactions,
        loading,
        headers: { next, prev },
        search,
        filters,
    } = useSelector(selectTransactionsTable);
    const appliedFilters = useSelector(countTransactionsAppliedFilters);
    const { mapSpecialOptions, getSpecialFilter } = useFilter(t);
    const actionsData = useActionListData({ filters, search, list: transactions });

    const tabsConfig: TabFilter<TransactionsTableColumn, StatusGroups, GetStatusesResponse>[] = useMemo(
        () => config?.specific?.transactions?.tabs || DEFAULT_FILTER_TABS__TRANSACTIONS,
        [config],
    );

    const {
        loadTransactions,
        loadTransactionsNextPage,
        loadTransactionsPrevPage,
        updateTransactionsSearch,
        resetTransactions,
        searchTransactions,
        updateTransactionsFilters,
    } = useActions(transactionsActions);

    const selectedTab = useMemo(
        () => tabsConfig.find(({ key }) => key === selectedTabKey),
        [selectedTabKey, tabsConfig],
    );

    const updateSearch = useCallback(
        (search: string) => {
            updateTransactionsSearch({ route: selectedTab?.url, search });
        },
        [selectedTab?.url, updateTransactionsSearch],
    );

    const selectedTabActions = selectedTab?.actions || config?.specific?.transactions?.actions;

    const filterGroups =
        selectedTab?.filters?.filterGroups ||
        config?.specific?.transactions?.filters?.filterGroups ||
        DEFAULT_FILTER__TRANSACTION_LIST.filterGroups;

    useEffect(() => {
        // reload and pass empty object to clear state
        navigate(pathname, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTransactions = useCallback(() => {
        !!selectedTab?.url && loadTransactions({ route: selectedTab.url, filterTabConfig: selectedTab.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadTransactions, selectedTab?.url]);

    useEffect(() => {
        !selectedTab &&
            tabsConfig[0] &&
            navigate([`/${baseRoute}`, ROUTE_TRANSACTIONS, tabsConfig[0].key].join('/'), { state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseRoute, navigate, selectedTab?.url, tabsConfig, state]);

    useEffect(() => {
        if (!privileges?.size) return;
        if (!privileges.has(PRIVILEGE_TRANSACTION_LIST)) {
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            return;
        }

        // @ts-ignore
        !state?.noRefresh && getTransactions();
    }, [baseRoute, getTransactions, navigate, privileges, state]);

    useEffect(() => {
        return () => {
            resetTransactions();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowEmptyScreen =
        selectedTabKey === ALL_TAB && !transactions?.length && !loading && !search && !appliedFilters;

    return (
        <StyledSpace>
            {tabsConfig.length > 1 && (
                <Tabs
                    tabsConfig={tabsConfig}
                    route={ROUTE_TRANSACTIONS}
                    onChangeTab={resetTransactions}
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
                                data={actionsData}
                                refreshActionsMap={refreshActionsMap}
                                t={t}
                            />
                        </FlexEndBlock>
                    )}
                    <EmptyState title={t('transactions.empty.title')} subtitle={t('transactions.empty.subtitle')} />
                </>
            ) : (
                <>
                    <ControlRow>
                        <SearchInput
                            updateSearchValue={updateSearch}
                            handleSearch={searchTransactions}
                            value={search}
                            placeholder={t('transactions.search.placeholder')}
                        />
                        <FilterDrawer
                            t={t}
                            data={actionsData}
                            filters={filters}
                            countFilters={appliedFilters}
                            filterGroups={filterGroups}
                            updateFilter={updateTransactionsFilters}
                            applyFilter={getTransactions}
                            mapSpecialOptions={mapSpecialOptions}
                            getSpecialFilter={getSpecialFilter}
                        />
                        <Spacer />
                        {!!selectedTabActions && (
                            <CustomActions
                                actionsConfig={selectedTabActions}
                                data={actionsData}
                                refreshActionsMap={refreshActionsMap}
                                t={t}
                            />
                        )}
                    </ControlRow>
                    <TransactionsTable
                        transactions={transactions}
                        loading={loading}
                        specialTabTable={selectedTab.table}
                    />
                    <Pagination
                        loading={loading}
                        loadNextPage={loadTransactionsNextPage}
                        loadPrevPage={loadTransactionsPrevPage}
                        next={next}
                        prev={prev}
                    />
                </>
            )}
        </StyledSpace>
    );
};
