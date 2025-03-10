import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type {
    OrderShipments,
    RootState,
    ShipmentCreationPayload,
    GetAllShipmentsSuccessPayload,
    LoadPayload,
    ShipmentsParams,
    TransitionPayload,
} from '~/models';

import { defaultState } from '../store/initialStates';

type Shipments = RootState['shipments'];

interface SliceShipmentsReducer extends SliceCaseReducers<Shipments> {
    getOrderShipmentsRequest: CaseReducer<Shipments, PayloadAction<string>>;
    getOrderShipmentsSuccess: CaseReducer<Shipments, PayloadAction<OrderShipments>>;
    getOrderShipmentsFailure: CaseReducer<Shipments>;
    resetOrderShipments: CaseReducer<Shipments>;
    resetShipments: CaseReducer<Shipments>;
    deleteShipmentAttachment: CaseReducer<
        Shipments,
        PayloadAction<{ id: string; attachmentId: string; onSuccess: () => void }>
    >;
    deleteShipmentAttachmentSuccess: CaseReducer<Shipments>;
    deleteShipmentAttachmentFailure: CaseReducer<Shipments>;
    createShipment: CaseReducer<Shipments, PayloadAction<ShipmentCreationPayload & { onSuccess: () => void }>>;
    createShipmentSuccess: CaseReducer<Shipments>;
    createShipmentFailure: CaseReducer<Shipments>;
    getAllShipmentsRequest: CaseReducer<Shipments>;
    getAllShipmentsSuccess: CaseReducer<Shipments, PayloadAction<GetAllShipmentsSuccessPayload>>;
    getAllShipmentsFailure: CaseReducer<Shipments>;
    loadShipments: CaseReducer<Shipments, PayloadAction<LoadPayload>>;
    loadShipmentsNextPage: CaseReducer<Shipments>;
    loadShipmentsPrevPage: CaseReducer<Shipments>;
    updateShipmentsFilters: CaseReducer<Shipments, PayloadAction<Shipments['table']['filters']>>;
    updateShipmentsSearch: CaseReducer<Shipments, PayloadAction<Partial<ShipmentsParams>>>;
    applyShipmentTransition: CaseReducer<
        Shipments,
        PayloadAction<{ id: string; onError: () => void; onSuccess: () => void } & TransitionPayload>
    >;
    applyShipmentTransitionSuccess: CaseReducer<Shipments>;
    applyShipmentTransitionFailure: CaseReducer<Shipments>;
    searchDeliveries: CaseReducer<Shipments>;
}

export const sliceShipments = createSlice<Shipments, SliceShipmentsReducer>({
    initialState: defaultState.shipments,
    name: '@@shipments',
    reducers: {
        /*** shipments to display on delivery tab ***/
        getOrderShipmentsRequest: (state) => {
            state.orderShipments.loading = true;
        },
        getOrderShipmentsSuccess: (state, { payload }) => {
            state.orderShipments.shipments = payload.shipments;
            state.orderShipments.orderId = payload.orderId;
            state.orderShipments.loading = false;
        },
        getOrderShipmentsFailure: (state) => {
            state.orderShipments.loading = false;
        },
        resetOrderShipments: (state) => {
            state.orderShipments = defaultState.shipments.orderShipments;
        },
        /*** shipments table ***/
        getAllShipmentsRequest: (state) => {
            state.table.loading = true;
            state.table.headers.next = state.table.headers.prev = undefined;
            state.table.shipments = defaultState.shipments.table.shipments;
        },
        getAllShipmentsSuccess: (state, { payload }) => {
            const { next, previous } = payload.headers;
            state.table.loading = false;
            state.table.shipments = payload.data.shipments;
            state.table.headers.next = next;
            state.table.headers.prev = previous;
        },
        getAllShipmentsFailure: (state) => {
            state.table.loading = false;
        },
        updateShipmentsFilters: (state, { payload }) => {
            state.table.filters = payload;
        },
        updateShipmentsSearch: (state, { payload }) => {
            payload.search !== undefined && (state.table.search = payload.search);
        },
        searchDeliveries: (state) => {
            state.table.loading = true;
        },
        /*** common ***/
        resetShipments: (state) => {
            state = defaultState.shipments;
        },
        /*** delete attachment from shipment ***/
        deleteShipmentAttachment: (state) => {},
        deleteShipmentAttachmentSuccess: (state) => {},
        deleteShipmentAttachmentFailure: (state) => {},
        /*** create shipment ***/
        createShipment: (state) => {
            state.isCreatingShipment = true;
        },
        createShipmentSuccess: (state) => {
            state.isCreatingShipment = false;
        },
        createShipmentFailure: (state) => {
            state.isCreatingShipment = false;
        },
        loadShipments: () => {},
        loadShipmentsNextPage: () => {},
        loadShipmentsPrevPage: () => {},
        /*** Complete shipment ***/
        applyShipmentTransition: (state) => {
            state.orderShipments.isApplyingTransition = true;
        },
        applyShipmentTransitionSuccess: (state) => {
            state.orderShipments.isApplyingTransition = false;
        },
        applyShipmentTransitionFailure: (state) => {
            state.orderShipments.isApplyingTransition = false;
        },
    },
});

export const shipmentsActions = sliceShipments.actions;

export const {
    getOrderShipmentsRequest,
    getOrderShipmentsSuccess,
    getOrderShipmentsFailure,
    resetOrderShipments,
    resetShipments,
    deleteShipmentAttachment,
    deleteShipmentAttachmentSuccess,
    deleteShipmentAttachmentFailure,
    createShipment,
    createShipmentSuccess,
    createShipmentFailure,
    getAllShipmentsRequest,
    getAllShipmentsSuccess,
    getAllShipmentsFailure,
    loadShipments,
    loadShipmentsNextPage,
    loadShipmentsPrevPage,
    updateShipmentsFilters,
    updateShipmentsSearch,
    applyShipmentTransition,
    applyShipmentTransitionSuccess,
    applyShipmentTransitionFailure,
    searchDeliveries,
} = shipmentsActions;
