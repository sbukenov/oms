import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { RootState, ModuleConfigFull } from '~/models';

import { defaultState } from '../store/initialStates';

type Config = RootState['config'];

interface SliceConfigReducer extends SliceCaseReducers<Config> {
    addConfig: CaseReducer<Config, PayloadAction<ModuleConfigFull>>;
}

export const sliceConfig = createSlice<Config, SliceConfigReducer>({
    initialState: defaultState.config,
    name: '@@config',
    reducers: {
        addConfig: (state, { payload }) => payload,
    },
});

export const configActions = sliceConfig.actions;

export const { addConfig } = configActions;
