import type { RootState } from '~/models';

export const selectTypes = (state: RootState) => state.types;
export const selectOrderTypes = (state: RootState) => state.types?.Order;
export const selectTransactionTypes = (state: RootState) => state.types?.Transaction;
export const selectReturnTypes = (state: RootState) => state.types?.OrderReturn;
