import { PayloadAction, createSlice, SliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';

import type { GetStatusesResponse, RootState } from '~/models';

import { defaultState } from '../store/initialStates';

type Statuses = RootState['statuses'];

interface SliceStatusesReducer extends SliceCaseReducers<Statuses> {
    getAllStatuses: CaseReducer<Statuses>;
    getAllStatusesSuccess: CaseReducer<Statuses, PayloadAction<GetStatusesResponse>>;
    getAllStatusesFailure: CaseReducer<Statuses>;
}

export const sliceStatuses = createSlice<Statuses, SliceStatusesReducer>({
    initialState: defaultState.statuses,
    name: '@@statuses',
    reducers: {
        getAllStatusesSuccess: (state, { payload }) => payload,
        /*** no state change ***/
        getAllStatuses: () => {},
        getAllStatusesFailure: () => {},
    },
});

export const statusesActions = sliceStatuses.actions;

export const { getAllStatuses, getAllStatusesSuccess, getAllStatusesFailure } = statusesActions;
