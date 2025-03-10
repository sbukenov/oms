import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { Types, RootState } from '~/models';

import { defaultState } from '../store/initialStates';

type TypesState = RootState['types'];

interface SliceTypesReducer extends SliceCaseReducers<TypesState> {
    getTypes: CaseReducer<TypesState>;
    getTypesSuccess: CaseReducer<TypesState, PayloadAction<Types>>;
    getTypesFailure: CaseReducer<TypesState>;
}

export const sliceTypes = createSlice<TypesState, SliceTypesReducer>({
    initialState: defaultState.types,
    name: '@@types',
    reducers: {
        getTypesSuccess: (state, { payload }) => payload,
        /*** no state change ***/
        getTypes: () => {},
        getTypesFailure: () => {},
    },
});

export const typesActions = sliceTypes.actions;

export const { getTypes, getTypesSuccess, getTypesFailure } = typesActions;
