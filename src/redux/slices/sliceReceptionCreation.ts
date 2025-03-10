import React from 'react';
import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { Product, ReceptionQuantitiesById, ReplenishmentOperation, RootState } from '~/models';
import { mapProductsByUuidId } from '~/utils';

import { defaultState } from '../store/initialStates';

type ReceptionCreation = RootState['receptionCreation'];

interface SliceReceptionCreationReducer extends SliceCaseReducers<ReceptionCreation> {
    getReception: CaseReducer<ReceptionCreation, PayloadAction<{ orderId: string; expeditionId: string }>>;
    getReceptionSuccess: CaseReducer<ReceptionCreation, PayloadAction<ReplenishmentOperation>>;
    getReceptionFailure: CaseReducer<ReceptionCreation>;
    createReception: CaseReducer<
        ReceptionCreation,
        PayloadAction<{ quantitiesById: ReceptionQuantitiesById; onSuccess: () => void }>
    >;
    createReceptionSuccess: CaseReducer<ReceptionCreation>;
    createReceptionFailure: CaseReducer<ReceptionCreation>;
    addReceptionProductKeys: CaseReducer<ReceptionCreation, PayloadAction<React.Key[]>>;
    addReceptionProducts: CaseReducer<ReceptionCreation, PayloadAction<Product[]>>;
    deleteReceptionProduct: CaseReducer<ReceptionCreation, PayloadAction<string>>;
    resetReceptionCreation: CaseReducer<ReceptionCreation>;
}

export const sliceReceptionCreation = createSlice<ReceptionCreation, SliceReceptionCreationReducer>({
    initialState: defaultState.receptionCreation,
    name: '@@receptionCreation',
    reducers: {
        getReception: (state) => {
            state.loading = true;
        },
        getReceptionSuccess: (state, { payload }) => {
            state.loading = false;
            state.reception = payload;
        },
        getReceptionFailure: (state) => {
            state.loading = false;
        },
        createReception: () => {},
        createReceptionSuccess: () => {},
        createReceptionFailure: () => {},
        addReceptionProductKeys: () => {},
        addReceptionProducts: (state, { payload }) => {
            state.productsByUuid = mapProductsByUuidId(payload, state.productsByUuid, true);
        },
        deleteReceptionProduct: (state, { payload: uuidToRemove }) => {
            const { [uuidToRemove]: productToRemove, ...restOfProducts } = state.productsByUuid;
            state.productsByUuid = restOfProducts;
        },
        resetReceptionCreation: () => defaultState.receptionCreation,
    },
});

export const receptionCreationActions = sliceReceptionCreation.actions;

export const {
    getReception,
    getReceptionSuccess,
    getReceptionFailure,
    createReception,
    createReceptionSuccess,
    createReceptionFailure,
    addReceptionProductKeys,
    addReceptionProducts,
    deleteReceptionProduct,
    resetReceptionCreation,
} = receptionCreationActions;
