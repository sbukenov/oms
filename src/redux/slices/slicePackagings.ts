import { createSlice, SliceCaseReducers, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import type { ClientResponse } from 'sdkore';

import type { GetPackagingsResponse, RootState } from '~/models';

import { defaultState } from '../store/initialStates';

type Packagings = RootState['packagings'];

interface SlicePackagingsReducer extends SliceCaseReducers<Packagings> {
    getPackagingsRequest: CaseReducer<Packagings>;
    getPackagingsSuccess: CaseReducer<Packagings, PayloadAction<ClientResponse<GetPackagingsResponse>>>;
    getPackagingsFailure: CaseReducer<Packagings>;
    loadPackagings: CaseReducer<Packagings, PayloadAction<string | undefined>>;
    searchPackagings: CaseReducer<Packagings, PayloadAction<string | undefined>>;
    resetPackagings: CaseReducer<Packagings>;
}

export const slicePackagings = createSlice<Packagings, SlicePackagingsReducer>({
    initialState: defaultState.packagings,
    name: '@@packagings',
    reducers: {
        getPackagingsRequest: (state) => {
            state.loading = true;
        },
        getPackagingsSuccess: (state, { payload }) => {
            const { next } = payload.headers;
            state.loading = false;
            if (state.next) {
                state.packagings = state.packagings.concat(payload.data.packaging_lines);
            } else {
                state.packagings = payload.data.packaging_lines;
            }
            state.next = next;
        },
        getPackagingsFailure: (state) => {
            state.loading = false;
        },
        resetPackagings: () => defaultState.packagings,
        loadPackagings: () => {},
        searchPackagings: () => {},
    },
});

export const packagingsActions = slicePackagings.actions;

export const {
    getPackagingsRequest,
    getPackagingsFailure,
    getPackagingsSuccess,
    resetPackagings,
    loadPackagings,
    searchPackagings,
} = packagingsActions;
