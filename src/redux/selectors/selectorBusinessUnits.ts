import { BusinessUnitType, RootState } from '~/models';

export const selectOrdersBusinessUnits = (state: RootState) => state.businessUnits;
export const selectSupplierBusinessUnits = (state: RootState) =>
    state.businessUnits.filter(({ type }) => type === BusinessUnitType.SUPPLIER);
