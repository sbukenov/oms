import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';

import {
    ALL_TAB,
    DEFAULT_FILTER_TABS__RETURNS,
    ROUTE_RETURNS,
    ROUTE_NO_ACCESS,
    PRIVILEGE_RETURN_LIST,
    QA_ORDER_TAB,
    DEFAULT_FILTER__RETURN_LIST,
} from '~/const';
import { useActions, useFilter, useActionListData } from '~/hooks';
import { countReturnsAppliedFilters, selectReturnsTable } from '~/redux/selectors';
import { refreshActionsMap, returnsActions } from '~/redux/slices';
import type { ReturnsTableColumn, StatusGroups, GetStatusesResponse } from '~/models';
import { EmptyState } from '~/components';
import { getModuleContext } from '~/utils';
import { ControlRow, Spacer } from '~/style/commonStyle';

import { ReturnsTable } from './ReturnsTable';

export const Returns: FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { key: selectedTabKey } = useParams<KeyParam>();
    const { baseRoute, config } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const {
        returns,
        loading,
        headers: { next, prev },
        search,
        filters,
    } = useSelector(selectReturnsTable);
    const appliedFilters = useSelector(countReturnsAppliedFilters);
    const { mapSpecialOptions, getSpecialFilter } = useFilter(t);
    const actionsData = useActionListData({ filters, search, list: returns });

    const tabsConfig: TabFilter<ReturnsTableColumn, StatusGroups, GetStatusesResponse>[] = useMemo(
        () => config?.specific?.returns?.tabs || DEFAULT_FILTER_TABS__RETURNS,
        [config],
    );

    const {
        loadReturns,
        loadReturnsNextPage,
        loadReturnsPrevPage,
        updateReturnsSearch,
        resetReturns,
        searchReturns,
        updateReturnFilters,
    } = useActions(returnsActions);

    const selectedTab = useMemo(
        () => tabsConfig.find(({ key }) => key === selectedTabKey),
        [selectedTabKey, tabsConfig],
    );

    const updateSearch = useCallback(
        (search: string) => {
            updateReturnsSearch({ route: selectedTab?.url, search });
        },
        [selectedTab?.url, updateReturnsSearch],
    );

    const selectedTabActions = selectedTab?.actions || config?.specific?.returns?.actions;

    const filterGroups =
        selectedTab?.filters?.filterGroups ||
        config?.specific?.returns?.filters?.filterGroups ||
        DEFAULT_FILTER__RETURN_LIST.filterGroups;

    useEffect(() => {
        // reload and pass empty object to clear state
        navigate(pathname, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getReturns = useCallback(() => {
        !!selectedTab?.url && loadReturns({ route: selectedTab.url, filterTabConfig: selectedTab.filters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadReturns, selectedTab?.url]);

    useEffect(() => {
        !selectedTab &&
            tabsConfig[0] &&
            navigate([`/${baseRoute}`, ROUTE_RETURNS, tabsConfig[0].key].join('/'), { state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseRoute, navigate, selectedTab?.url, tabsConfig, state]);

    useEffect(() => {
        if (!privileges?.size) return;
        if (!privileges.has(PRIVILEGE_RETURN_LIST)) {
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            return;
        }

        // @ts-ignore
        !state?.noRefresh && getReturns();
    }, [baseRoute, getReturns, navigate, privileges, state]);

    useEffect(() => {
        return () => {
            resetReturns();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowEmptyScreen =
        selectedTabKey === ALL_TAB && !returns?.length && !loading && !search && !appliedFilters;

    return (
        <StyledSpace>
            {tabsConfig.length > 1 && (
                <Tabs
                    tabsConfig={tabsConfig}
                    route={ROUTE_RETURNS}
                    onChangeTab={resetReturns}
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
                    <EmptyState title={t('returns.empty.title')} subtitle={t('returns.empty.subtitle')} />
                </>
            ) : (
                <>
                    <ControlRow>
                        <SearchInput
                            updateSearchValue={updateSearch}
                            handleSearch={searchReturns}
                            value={search}
                            placeholder={t('returns.search.placeholder')}
                        />
                        <FilterDrawer
                            t={t}
                            data={actionsData}
                            filters={filters}
                            countFilters={appliedFilters}
                            filterGroups={filterGroups}
                            updateFilter={updateReturnFilters}
                            applyFilter={getReturns}
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
                    <ReturnsTable returns={returns} loading={loading} specialTabTable={selectedTab.table} />
                    <Pagination
                        loading={loading}
                        loadNextPage={loadReturnsNextPage}
                        loadPrevPage={loadReturnsPrevPage}
                        next={next}
                        prev={prev}
                    />
                </>
            )}
        </StyledSpace>
    );
};
