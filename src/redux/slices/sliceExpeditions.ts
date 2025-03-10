import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { RootState, ReplenishmentOperation } from '~/models';

import { defaultState } from '../store/initialStates';

type Expeditions = RootState['expeditions'];

interface SliceExpeditionsReducer extends SliceCaseReducers<Expeditions> {
    getOrderExpeditionsRequest: CaseReducer<Expeditions, PayloadAction<string>>;
    getOrderExpeditionsSuccess: CaseReducer<
        Expeditions,
        PayloadAction<{ expeditions: ReplenishmentOperation[]; orderId: string }>
    >;
    getOrderExpeditionsFailure: CaseReducer<Expeditions>;
    deleteExpeditionAttachment: CaseReducer<
        Expeditions,
        PayloadAction<{ attachmentId: string; onSuccess: () => void }>
    >;
    deleteExpeditionAttachmentSuccess: CaseReducer<Expeditions>;
    deleteExpeditionAttachmentFailure: CaseReducer<Expeditions>;
    resetOrderExpeditions: CaseReducer<Expeditions>;
}

export const sliceExpeditions = createSlice<Expeditions, SliceExpeditionsReducer>({
    initialState: defaultState.expeditions,
    name: '@@expeditions',
    reducers: {
        getOrderExpeditionsRequest: (state) => {
            state.orderExpeditions.loading = true;
        },
        getOrderExpeditionsSuccess: (state, { payload }) => {
            state.orderExpeditions.expeditions = payload.expeditions;
            state.orderExpeditions.orderId = payload.orderId;
            state.orderExpeditions.loading = false;
        },
        getOrderExpeditionsFailure: (state) => {
            state.orderExpeditions.loading = false;
        },
        deleteExpeditionAttachment: (state) => {
            state.isDeletingAttachment = true;
        },
        deleteExpeditionAttachmentSuccess: (state) => {
            state.isDeletingAttachment = false;
        },
        deleteExpeditionAttachmentFailure: (state) => {
            state.isDeletingAttachment = false;
        },
        resetOrderExpeditions: (state) => {
            state.orderExpeditions = defaultState.expeditions.orderExpeditions;
        },
    },
});

export const expeditionsActions = sliceExpeditions.actions;

export const {
    getOrderExpeditionsRequest,
    getOrderExpeditionsSuccess,
    getOrderExpeditionsFailure,
    deleteExpeditionAttachment,
    deleteExpeditionAttachmentSuccess,
    deleteExpeditionAttachmentFailure,
    resetOrderExpeditions,
} = expeditionsActions;
