import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { RootState, ReplenishmentOperation } from '~/models';

import { defaultState } from '../store/initialStates';

type Receptions = RootState['receptions'];

interface SliceReceptionsReducer extends SliceCaseReducers<Receptions> {
    getOrderReceptionsRequest: CaseReducer<Receptions, PayloadAction<string>>;
    getOrderReceptionsSuccess: CaseReducer<
        Receptions,
        PayloadAction<{ receptions: ReplenishmentOperation[]; orderId: string }>
    >;
    getOrderReceptionsFailure: CaseReducer<Receptions>;
    resetOrderReceptions: CaseReducer<Receptions>;
}

export const sliceReceptions = createSlice<Receptions, SliceReceptionsReducer>({
    initialState: defaultState.receptions,
    name: '@@receptions',
    reducers: {
        getOrderReceptionsRequest: (state) => {
            state.orderReceptions.loading = true;
        },
        getOrderReceptionsSuccess: (state, { payload }) => {
            state.orderReceptions.receptions = payload.receptions;
            state.orderReceptions.orderId = payload.orderId;
            state.orderReceptions.loading = false;
        },
        getOrderReceptionsFailure: (state) => {
            state.orderReceptions.loading = false;
        },
        resetOrderReceptions: (state) => {
            state.orderReceptions = defaultState.receptions.orderReceptions;
        },
    },
});

export const receptionsActions = sliceReceptions.actions;

export const { getOrderReceptionsRequest, getOrderReceptionsSuccess, getOrderReceptionsFailure, resetOrderReceptions } =
    receptionsActions;
