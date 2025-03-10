import type { RootState } from '~/models';

export const selectOrdersStatuses = (state: RootState) => state.statuses;
