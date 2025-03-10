import { createSlice, SliceCaseReducers, CaseReducer, PayloadAction } from '@reduxjs/toolkit';

import type { InitialStore, ModuleConfigFull } from '~/models';
import { defaultState } from '../store/initialStates';

interface SliceInitialReducer extends SliceCaseReducers<InitialStore> {
    initAction: CaseReducer<InitialStore, PayloadAction<ModuleConfigFull>>;
    initActionSuccess: CaseReducer<InitialStore>;
}

export const sliceInitial = createSlice<InitialStore, SliceInitialReducer>({
    initialState: defaultState.initial,
    name: '@@initial',
    reducers: {
        initAction: () => {},
        initActionSuccess: (state) => {
            state.isInitialized = true;
        },
    },
});

export const initialActions = sliceInitial.actions;

export const { initAction, initActionSuccess } = initialActions;
