import { CustomActionConfiguration, ConfigRules } from '@-bo/utils';
import type { Privileges } from '@-types/bo-module-aggregator';
import type { TabFilter, FilterConfig } from '@-bo/keystone-components';

import type {
    OrderContentTableColumn,
    OrdersTableColumn,
    OrderFulfillmentTableColumn,
    OrderShipmentTableColumn,
    CustomerPanelLines,
    OrderDetailsPanelLines,
    OrderReturnTableColumn,
    OrderTransactionTableColumn,
    OrderAmounts,
    FulfillmentAdditionalInfoLines,
    ReturnAdditionalInfoLines,
    ShipmentAdditionalInfoLines,
    TransactionAdditionalInfoLines,
    FulfillmentsTableColumn,
    ReturnsTableColumn,
    OrderTransactionAmounts,
    ShipmentsTableColumn,
    TransactionsTableColumn,
    ProductsTableColumn,
    CreationTableColumn,
    OrderReplenishmentTableColumn,
    OrderExpeditionTableColumn,
    OrderReceptionTableColumn,
    ExpeditionAdditionalInfoLines,
    ReceptionAdditionalInfoLines,
    ReceptionDetailsTableColumn,
    ReceptionDetailsAmounts,
    ExpeditionAmounts,
    ReceptionAmounts,
} from './configuration';
import type { StatusesByStatusGroup, StatusGroups } from './InterfaceStatusInfo';
import type { GetStatusesResponse } from './store/InterfaceOrdersPage';

export interface ModuleConfig {
    orders?: {
        isSelectedEntityIncluded?: boolean;
        table?: OrdersTableColumn[];
        tabs?: TabFilter<OrdersTableColumn, StatusGroups, GetStatusesResponse>[];
        filters?: FilterConfig<StatusGroups, GetStatusesResponse>;
        actions?: CustomActionConfiguration[];
    };
    preparations?: {
        isSelectedEntityIncluded?: boolean;
        table?: FulfillmentsTableColumn[];
        tabs?: TabFilter<FulfillmentsTableColumn, StatusGroups, GetStatusesResponse>[];
        filters?: FilterConfig<StatusGroups, GetStatusesResponse>;
        actions?: CustomActionConfiguration[];
    };
    deliveries?: {
        isSelectedEntityIncluded?: boolean;
        table?: ShipmentsTableColumn[];
        tabs?: TabFilter<ShipmentsTableColumn, StatusGroups, GetStatusesResponse>[];
        filters?: FilterConfig<StatusGroups, GetStatusesResponse>;
        actions?: CustomActionConfiguration[];
    };
    returns?: {
        isSelectedEntityIncluded?: boolean;
        table?: ReturnsTableColumn[];
        tabs?: TabFilter<ReturnsTableColumn, StatusGroups, GetStatusesResponse>[];
        filters?: FilterConfig<StatusGroups, GetStatusesResponse>;
        actions?: CustomActionConfiguration[];
    };
    transactions?: {
        isSelectedEntityIncluded?: boolean;
        table?: TransactionsTableColumn[];
        tabs?: TabFilter<TransactionsTableColumn, StatusGroups, GetStatusesResponse>[];
        filters?: FilterConfig<StatusGroups, GetStatusesResponse>;
        actions?: CustomActionConfiguration[];
    };
    orderDetails?: {
        actions?: CustomActionConfiguration[];
        tabs?: {
            synthesis?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderContentTableColumn[];
                panels?: {
                    customer?: CustomerPanelLines[];
                    orderDetails?: OrderDetailsPanelLines[];
                };
                lineActions?: CustomActionConfiguration[];
                totalAmounts?: OrderAmounts[];
            };
            order?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderReplenishmentTableColumn[];
                panels?: {
                    supplier?: CustomerPanelLines[];
                    customer?: CustomerPanelLines[];
                    orderDetails?: OrderDetailsPanelLines[];
                };
                lineActions?: CustomActionConfiguration[];
                totalAmounts?: OrderAmounts[];
            };
            expedition?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderExpeditionTableColumn[];
                additionalInfo?: ExpeditionAdditionalInfoLines[];
                actions?: CustomActionConfiguration[];
                totalAmounts?: ExpeditionAmounts[];
            };
            reception?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderReceptionTableColumn[];
                additionalInfo?: ReceptionAdditionalInfoLines[];
                actions?: CustomActionConfiguration[];
                totalAmounts?: ReceptionAmounts[];
            };
            preparation?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderFulfillmentTableColumn[];
                lineActions?: CustomActionConfiguration[];
                actions?: CustomActionConfiguration[];
                additionalInfo?: FulfillmentAdditionalInfoLines[];
            };
            delivery?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderShipmentTableColumn[];
                lineActions?: CustomActionConfiguration[];
                actions?: CustomActionConfiguration[];
                additionalInfo?: ShipmentAdditionalInfoLines[];
            };
            return?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderReturnTableColumn[];
                lineActions?: CustomActionConfiguration[];
                actions?: CustomActionConfiguration[];
                additionalInfo?: ReturnAdditionalInfoLines[];
            };
            transaction?: {
                displayComments?: boolean;
                rules?: Record<string, ConfigRules>;
                table?: OrderTransactionTableColumn[];
                actions?: CustomActionConfiguration[];
                lineActions?: CustomActionConfiguration[];
                totalAmounts?: OrderTransactionAmounts[];
                additionalInfo?: TransactionAdditionalInfoLines[];
            };
        };
    };
    orderCreation?: {
        table?: CreationTableColumn[];
        productsTable?: ProductsTableColumn[];
    };
    receptionDetails?: {
        table?: ReceptionDetailsTableColumn[];
        totalAmounts?: ReceptionDetailsAmounts[];
    };
    statuses?: StatusesByStatusGroup;
    files?: {
        maxSize?: number;
        formats?: string[];
    };
}

export type ModuleConfigFull = ModuleConfig & { baseRoute?: string; privileges?: Privileges };
