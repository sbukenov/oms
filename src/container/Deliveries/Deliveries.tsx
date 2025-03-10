import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { usePrivileges, KeyParam } from '@-bo/utils';
import { CustomActions, Pagination, SearchInput, StyledSpace, FilterDrawer } from '@-bo/keystone-components';
import { TabFilter, Tabs, FlexEndBlock } from '@-bo/keystone-components';

import { useActions, useFilter, useActionListData } from '~/hooks';
import { selectShipmentsTable, countShipmentsAppliedFilters } from '~/redux/selectors';
import { refreshActionsMap, shipmentsActions } from '~/redux/slices';
import {
    DEFAULT_FILTER_TABS__SHIPMENTS,
    ROUTE_DELIVERIES,
    ALL_TAB,
    ROUTE_NO_ACCESS,
    PRIVILEGE_DELIVERY_LIST,
    QA_ORDER_TAB,
    DEFAULT_FILTER__SHIPMENT_LIST,
} from '~/const';
import type { ShipmentsTableColumn, StatusGroups, GetStatusesResponse } from '~/models';
import { getModuleContext } from '~/utils';
import { EmptyState } from '~/components';
import { ControlRow, Spacer } from '~/style/commonStyle';

import { DeliveriesTable } from './DeliveriesTable';

export const Deliveries: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { key: selectedTabKey } = useParams<KeyParam>();
    const { baseRoute, config } = useContext(getModuleContext());
    const privileges = usePrivileges(getModuleContext());
    const {
        shipments,
        loading,
        headers: { next, prev },
        search,
        filters,
    } = useSelector(selectShipmentsTable);
    const appliedFilters = useSelector(countShipmentsAppliedFilters);
    const { mapSpecialOptions, getSpecialFilter } = useFilter(t);
    const actionsData = useActionListData({ filters, search, list: shipments });

    const tabsConfig: TabFilter<ShipmentsTableColumn, StatusGroups, GetStatusesResponse>[] = useMemo(
        () => config?.specific?.deliveries?.tabs || DEFAULT_FILTER_TABS__SHIPMENTS,
        [config],
    );

    const {
        loadShipments,
        loadShipmentsNextPage,
        loadShipmentsPrevPage,
        updateShipmentsSearch,
        resetShipments,
        searchDeliveries,
        updateShipmentsFilters,
    } = useActions(shipmentsActions);

    const selectedTab = useMemo(
        () => tabsConfig.find(({ key }) => key === selectedTabKey),
        [selectedTabKey, tabsConfig],
    );

    const updateSearch = useCallback(
        (search: string) => {
            updateShipmentsSearch({ route: selectedTab?.url, search });
        },
        [selectedTab?.url, updateShipmentsSearch],
    );

    const selectedTabActions = selectedTab?.actions || config?.specific?.deliveries?.actions;

    const filterGroups =
        selectedTab?.filters?.filterGroups ||
        config?.specific?.deliveries?.filters?.filterGroups ||
        DEFAULT_FILTER__SHIPMENT_LIST.filterGroups;

    useEffect(() => {
        // reload and pass empty object to clear state
        navigate(pathname, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getShipments = useCallback(() => {
        !!selectedTab?.url && loadShipments({ route: selectedTab.url });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadShipments, selectedTab?.url]);

    useEffect(() => {
        !selectedTab &&
            tabsConfig[0] &&
            navigate([`/${baseRoute}`, ROUTE_DELIVERIES, tabsConfig[0].key].join('/'), { state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseRoute, navigate, selectedTab?.url, tabsConfig, state]);

    useEffect(() => {
        if (!privileges?.size) return;
        if (!privileges.has(PRIVILEGE_DELIVERY_LIST)) {
            navigate(`/${baseRoute}/${ROUTE_NO_ACCESS}`);
            return;
        }

        // @ts-ignore
        !state?.noRefresh && getShipments();
    }, [baseRoute, getShipments, navigate, privileges, state]);

    useEffect(() => {
        return () => {
            resetShipments();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldShowEmptyScreen =
        selectedTabKey === ALL_TAB && !shipments?.length && !loading && !search && !appliedFilters;

    return (
        <StyledSpace>
            {tabsConfig.length > 1 && (
                <Tabs
                    tabsConfig={tabsConfig}
                    route={ROUTE_DELIVERIES}
                    onChangeTab={resetShipments}
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
                    <EmptyState title={t('shipments.empty.title')} subtitle={t('shipments.empty.subtitle')} />
                </>
            ) : (
                <>
                    <ControlRow>
                        <SearchInput
                            updateSearchValue={updateSearch}
                            handleSearch={searchDeliveries}
                            value={search}
                            placeholder={t('shipments.search.placeholder')}
                        />
                        <FilterDrawer
                            t={t}
                            data={actionsData}
                            filters={filters}
                            countFilters={appliedFilters}
                            filterGroups={filterGroups}
                            updateFilter={updateShipmentsFilters}
                            applyFilter={getShipments}
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
                    <DeliveriesTable shipments={shipments} loading={loading} specialTabTable={selectedTab.table} />
                    <Pagination
                        loading={loading}
                        loadNextPage={loadShipmentsNextPage}
                        loadPrevPage={loadShipmentsPrevPage}
                        next={next}
                        prev={prev}
                    />
                </>
            )}
        </StyledSpace>
    );
};
