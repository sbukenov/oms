import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';
import type { BusinessUnit } from '@bo/utils';

import type { RootState } from '~/models';

import { defaultState } from '../store/initialStates';

type BusinessUnits = RootState['businessUnits'];

interface SliceBusinessUnitsReducer extends SliceCaseReducers<BusinessUnits> {
    getBusinessUnits: CaseReducer<BusinessUnits>;
    getBusinessUnitsSuccess: CaseReducer<BusinessUnits, PayloadAction<BusinessUnit[]>>;
    getBusinessUnitsFailure: CaseReducer<BusinessUnits>;
}

export const sliceBusinessUnits = createSlice<BusinessUnits, SliceBusinessUnitsReducer>({
    initialState: defaultState.businessUnits,
    name: '@@businessUnits',
    reducers: {
        getBusinessUnitsSuccess: (state, { payload }) => payload,
        /*** no state change ***/
        getBusinessUnits: () => {},
        getBusinessUnitsFailure: () => {},
    },
});

export const businessUnitsActions = sliceBusinessUnits.actions;

export const { getBusinessUnits, getBusinessUnitsSuccess, getBusinessUnitsFailure } = businessUnitsActions;
