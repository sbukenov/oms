import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type {
    OrderFulfillmentDetailed,
    RootState,
    FulfillmentPreparePayload,
    Fulfillment,
    FulfillmentItem,
    AddOutOfStockPayload,
    CancelOutOfStockPayload,
    confirmPreparationPayload,
    GetAllFulfillmentsSuccessPayload,
    LoadPayload,
    FulfillmentsParams,
} from '~/models';
import { calculatePicked } from '~/utils';

import { defaultState } from '../store/initialStates';

type Fulfillments = RootState['fulfillments'];

interface SliceFulfillmentsReducer extends SliceCaseReducers<Fulfillments> {
    getOrderFulfillmentDetailedRequest: CaseReducer<Fulfillments, PayloadAction<string>>;
    getOrderFulfillmentDetailedSuccess: CaseReducer<Fulfillments, PayloadAction<OrderFulfillmentDetailed>>;
    getOrderFulfillmentDetailedFailure: CaseReducer<Fulfillments>;
    resetOrderFulfillments: CaseReducer<Fulfillments>;
    prepareFulfillment: CaseReducer<Fulfillments, PayloadAction<FulfillmentPreparePayload>>;
    getFulfillmentDetails: CaseReducer<Fulfillments, PayloadAction<string>>;
    getFulfillmentDetailsSuccess: CaseReducer<Fulfillments, PayloadAction<Fulfillment>>;
    getFulfillmentDetailsFailure: CaseReducer<Fulfillments>;
    resetFulfillmentPreparation: CaseReducer<Fulfillments>;
    cancelOutOfStockAction: CaseReducer<Fulfillments, PayloadAction<CancelOutOfStockPayload>>;
    addOutOfStock: CaseReducer<Fulfillments, PayloadAction<AddOutOfStockPayload>>;
    resetFulfillments: CaseReducer<Fulfillments>;
    confirmPreparation: CaseReducer<Fulfillments, PayloadAction<confirmPreparationPayload>>;
    getAllFulfillments: CaseReducer<Fulfillments>;
    getAllFulfillmentsSuccess: CaseReducer<Fulfillments, PayloadAction<GetAllFulfillmentsSuccessPayload>>;
    getAllFulfillmentsFailure: CaseReducer<Fulfillments>;
    updateFulfillmentFilters: CaseReducer<Fulfillments, PayloadAction<Fulfillments['table']['filters']>>;
    loadFulfillments: CaseReducer<Fulfillments, PayloadAction<LoadPayload>>;
    loadFulfillmentsNextPage: CaseReducer<Fulfillments>;
    loadFulfillmentsPrevPage: CaseReducer<Fulfillments>;
    updateFulfillmentsSearch: CaseReducer<Fulfillments, PayloadAction<Partial<FulfillmentsParams>>>;
    searchFulfillments: CaseReducer<Fulfillments>;
}

const getFulfillmentQuantities = (state: Fulfillments, item: FulfillmentItem) => {
    const affectedItem = state.fulfillmentPreparation.data?.fulfillment_items?.find(
        (fulfillmentItem) => fulfillmentItem.id === item.id,
    );
    const pickedItemQuantity = calculatePicked(item);
    const outOfStockQuantity = affectedItem?.fulfilled_items_quantities.OUT_OF_STOCK || 0;
    return { affectedItem, pickedItemQuantity, outOfStockQuantity };
};

export const sliceFulfillments = createSlice<Fulfillments, SliceFulfillmentsReducer>({
    initialState: defaultState.fulfillments,
    name: '@@fulfillments',
    reducers: {
        /*** fulfillments to display on preparation tab  ***/
        getOrderFulfillmentDetailedRequest: (state) => {
            state.orderFulfillmentDetailed.loading = true;
        },
        getOrderFulfillmentDetailedSuccess: (state, { payload }) => {
            state.orderFulfillmentDetailed.data = payload;
            state.orderFulfillmentDetailed.loading = false;
        },
        getOrderFulfillmentDetailedFailure: (state) => {
            state.orderFulfillmentDetailed.loading = false;
        },
        resetOrderFulfillments: (state) => {
            state.orderFulfillmentDetailed = defaultState.fulfillments.orderFulfillmentDetailed;
        },
        /*** fulfillmentPreparation ***/
        getFulfillmentDetails: (state) => {
            state.fulfillmentPreparation.loading = true;
        },
        getFulfillmentDetailsSuccess: (state, { payload }) => {
            state.fulfillmentPreparation.loading = false;
            state.fulfillmentPreparation.data = payload;
        },
        getFulfillmentDetailsFailure: (state) => {
            state.fulfillmentPreparation.loading = false;
        },
        resetFulfillmentPreparation: (state) => {
            state.fulfillmentPreparation = defaultState.fulfillments.fulfillmentPreparation;
        },
        cancelOutOfStockAction: (state, { payload: { item } }) => {
            const { affectedItem, pickedItemQuantity, outOfStockQuantity } = getFulfillmentQuantities(state, item);
            if (!affectedItem) return;

            affectedItem.fulfilled_items_quantities = {
                ...affectedItem.fulfilled_items_quantities,
                PICKED: pickedItemQuantity + outOfStockQuantity,
                OUT_OF_STOCK: 0,
            };
        },
        addOutOfStock: (state, { payload: { item, quantityOutOfStock } }) => {
            const { affectedItem, pickedItemQuantity, outOfStockQuantity } = getFulfillmentQuantities(state, item);
            if (!affectedItem) return;

            affectedItem.fulfilled_items_quantities = {
                ...affectedItem?.fulfilled_items_quantities,
                PICKED: pickedItemQuantity - quantityOutOfStock,
                OUT_OF_STOCK: outOfStockQuantity + quantityOutOfStock,
            };
        },
        /*** fulfillments table ***/
        getAllFulfillments: (state) => {
            state.table.loading = true;
            state.table.headers.next = state.table.headers.prev = undefined;
            state.table.fulfillments = defaultState.fulfillments.table.fulfillments;
        },
        getAllFulfillmentsSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            state.table.loading = false;
            state.table.fulfillments = payload.data.fulfillments;
            state.table.headers.next = next;
            state.table.headers.prev = previous;
        },
        getAllFulfillmentsFailure: (state) => {
            state.table.loading = false;
        },
        updateFulfillmentFilters: (state, { payload }) => {
            state.table.filters = payload;
        },
        updateFulfillmentsSearch: (state, { payload }) => {
            payload.search !== undefined && (state.table.search = payload.search);
            state.table.route = payload?.route;
        },
        searchFulfillments: (state) => {
            state.table.loading = true;
        },
        loadFulfillments: (state, { payload }) => {
            state.table.route = payload?.route;
        },
        /*** common ***/
        resetFulfillments: (state) => {
            state = defaultState.fulfillments;
        },
        /*** no state change ***/
        prepareFulfillment: () => {},
        confirmPreparation: () => {},
        loadFulfillmentsNextPage: () => {},
        loadFulfillmentsPrevPage: () => {},
    },
});

export const fulfillmentsActions = sliceFulfillments.actions;

export const {
    getOrderFulfillmentDetailedRequest,
    getOrderFulfillmentDetailedSuccess,
    getOrderFulfillmentDetailedFailure,
    resetOrderFulfillments,
    prepareFulfillment,
    getFulfillmentDetails,
    getFulfillmentDetailsSuccess,
    getFulfillmentDetailsFailure,
    resetFulfillmentPreparation,
    resetFulfillments,
    cancelOutOfStockAction,
    addOutOfStock,
    confirmPreparation,
    getAllFulfillments,
    getAllFulfillmentsSuccess,
    getAllFulfillmentsFailure,
    loadFulfillments,
    loadFulfillmentsNextPage,
    loadFulfillmentsPrevPage,
    updateFulfillmentsSearch,
    updateFulfillmentFilters,
    searchFulfillments,
} = fulfillmentsActions;
