import type { RootState } from '~/models';

export const selectOrderReceptions = (state: RootState) => state.receptions.orderReceptions;
