import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { usePrivileges, KeyParam } from '@-bo/utils';
import {
    CustomActions,
    Pagination,
    SearchInput,
    StyledSpace,
    FilterDrawer,
    FlexEndBlock,
} from '@-bo/keystone-components';
import { useSelector } from 'react-redux';
import { TabFilter, Tabs } from '@-bo/keystone-components';

import { useActions, useFilter, useActionListData } from '~/hooks';
import { countFulfillmentsAppliedFilters, selectFulfillmentsFilters, selectFulfillmentsTable } from '~/redux/selectors';
import { fulfillmentsActions, refreshActionsMap } from '~/redux/slices';
import { EmptyState } from '~/components';
import {
    ALL_TAB,
    DEFAULT_FILTER_TABS__FULFILLMENTS,
    ROUTE_FULFILLMENTS,
    PRIVILEGE_PREPARATION_LIST,
    ROUTE_NO_ACCESS,
    QA_ORDER_TAB,
    DEFAULT_FILTER__FULFILLMENT_LIST,
} from '~/const';
import type { FulfillmentsTableColumn, StatusGroups, GetStatusesResponse } from '~/models';
import { getModuleContext } from '~/utils';
import { ControlRow, Spacer } from '~/style/commonStyle';

import { FulfillmentsTable } from './FulfillmentsTable';

export const Fulfillments: FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { key: selectedTabKey } = useParams<KeyParam>();
    const { baseRoute, config } = useContext(getModuleContext());
    const appliedFilters = useSelector(countFulfillmentsAppliedFilters);
    const filters = useSelector(selectFulfillmentsFilters);
    const privileges = usePrivileges(getModuleContext());
    const {
        fulfillments,
        loading,
        headers: { next, prev },
        search,
    } = useSelector(selectFulfillmentsTable);
    const { mapSpecialOptions, getSpecialFilter } = useFilter(t);
    const actionsData = useActionListData({ filters, search, list: fulfillments });

    const tabsConfig: TabFilter<FulfillmentsTableColumn, StatusGroups, GetStatusesResponse>[] = useMemo(
        () => config?.specific?.preparations?.tabs || DEFAULT_FILTER_TABS__FULFILLMENTS,
        [config],
    );

    const {
        loadFulfillments,
        updateFulfillmentFilters,
        loadFulfillmentsNextPage,
        loadFulfillmentsPrevPage,
        updateFulfillmentsSearch,
        resetFulfillments,
        searchFulfillments,
    } = useActions(fulfillmentsActions);

    const selectedTab = useMemo(
        () => tabsConfig.find(({ key }) => key === selectedTabKey),
        [selectedTabKey, tabsConfig],
    );

    const updateSearch = useCallback(
        (search: string) => {
            updateFulfillmentsSearch({ route: selectedTab?.url, search });
        },
        [selectedTab?.url, updateFulfillmentsSearch],
    );

    const selectedTabActions = selectedTab?.actions || config?.specific?.preparations?.actions;

    const filterGroups =
        selectedTab?.filters?.filterGroups ||
        config?.specific?.preparations?.filters?.filterGroups ||
        DEFAULT_FILTER__FULFILLMENT_LIST.filterGroups;

    useEffect(() => {
        // reload and pass empty object to clear state
        navigate(pathname, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getFulfillments = useCallback(() => {
        !!selectedTab?.url && loadFulfillments({ route: selectedTab.url, filterTabConfig: selectedTab.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadFulfillments, selectedTab?.url]);

    useEffect(() => {
        !selectedTab &&
            tabsConfig[0] &&
            navigate([`/${baseRoute}`, ROUTE_FULFILLMENTS, tabsConfig[0].key].join('/'), { state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseRoute, navigate, selectedTab?.url, tabsConfig, state]);

    useEffect(() => {
        if (!privileges?.size) return;
        if (!privileges.has(PRIVILEGE_PREPARATION_LIST)) {
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            return;
        }

        // @ts-ignore
        !state?.noRefresh && getFulfillments();
    }, [baseRoute, getFulfillments, navigate, privileges, state]);

    useEffect(() => {
        return () => {
            resetFulfillments();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowEmptyScreen =
        selectedTabKey === ALL_TAB && !fulfillments?.length && !loading && !search && !appliedFilters;

    return (
        <StyledSpace>
            {tabsConfig.length > 1 && (
                <Tabs
                    tabsConfig={tabsConfig}
                    route={ROUTE_FULFILLMENTS}
                    onChangeTab={resetFulfillments}
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
                    <EmptyState title={t('fulfillments.empty.title')} subtitle={t('fulfillments.empty.subtitle')} />
                </>
            ) : (
                <>
                    <ControlRow>
                        <SearchInput
                            updateSearchValue={updateSearch}
                            handleSearch={searchFulfillments}
                            value={search}
                            placeholder={t('fulfillments.search.placeholder')}
                        />
                        <FilterDrawer
                            t={t}
                            data={actionsData}
                            filters={filters}
                            countFilters={appliedFilters}
                            filterGroups={filterGroups}
                            updateFilter={updateFulfillmentFilters}
                            applyFilter={getFulfillments}
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
                    <FulfillmentsTable
                        fulfillments={fulfillments}
                        loading={loading}
                        specialTabTable={selectedTab.table}
                    />
                    <Pagination
                        loading={loading}
                        loadNextPage={loadFulfillmentsNextPage}
                        loadPrevPage={loadFulfillmentsPrevPage}
                        next={next}
                        prev={prev}
                    />
                </>
            )}
        </StyledSpace>
    );
};
