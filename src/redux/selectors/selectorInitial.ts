import { RootState } from '~/models';

export const selectIsInitialized = (state: RootState) => state.initial.isInitialized;
