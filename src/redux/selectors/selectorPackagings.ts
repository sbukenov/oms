import type { RootState } from '~/models';

export const selectPackagings = (state: RootState) => state.packagings;

export const selectPackagingsList = (state: RootState) => state.packagings.packagings;

export const selectPackagingsNext = (state: RootState) => state.packagings.next;

export const selectPackagingsLoading = (state: RootState) => state.packagings.loading;
