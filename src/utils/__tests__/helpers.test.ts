import { convertMBtoB, calculateValueAndPrecision, getReplenishmentTotals, getReceptionMax } from '../helpers';
import type { Product, ReceptionQuantitiesById } from '../../models';

describe('convertMBtoB function', () => {
    it('should convert MB to B correctly', () => {
        expect(convertMBtoB(1)).toBe(1048576);
        expect(convertMBtoB(2)).toBe(2097152);
        expect(convertMBtoB(4)).toBe(4194304);
    });

    it('should work with floats', () => {
        expect(convertMBtoB(1.5)).toBe(1572864);
        expect(convertMBtoB(2.7)).toBe(2831155.2);
        expect(convertMBtoB(4.2)).toBe(4404019.2);
    });
});

describe('calculateValueAndPrecision function', () => {
    it('should work with floats', () => {
        expect(calculateValueAndPrecision('3.14')).toEqual({ value: 314, precision: 2 });
        expect(calculateValueAndPrecision('11.5')).toEqual({ value: 115, precision: 1 });
        expect(calculateValueAndPrecision('21315823.1455252')).toEqual({ value: 213158231455252, precision: 7 });
    });

    it('should work with integers', () => {
        expect(calculateValueAndPrecision('42')).toEqual({ value: 42, precision: 0 });
        expect(calculateValueAndPrecision('112')).toEqual({ value: 112, precision: 0 });
        expect(calculateValueAndPrecision('365000')).toEqual({ value: 365000, precision: 0 });
    });

    it('should throw error when input invalid', () => {
        expect(() => calculateValueAndPrecision('some-invalid-value')).toThrow('can not convert value to a number');
    });
});

describe('getReplenishmentTotals function', () => {
    it('should calculate totals', () => {
        const PRODUCTS = [
            {
                selectedPackaging: {
                    price: {
                        amount: {
                            value: 120,
                            precision: 1,
                        },
                        vat_rate: {
                            value: 200,
                            precision: 1,
                        },
                        grids: [],
                    },
                },
                quantity: 1,
            },
            {
                selectedPackaging: {
                    price: {
                        amount: {
                            value: 150,
                            precision: 1,
                        },
                        vat_rate: {
                            value: 200,
                            precision: 1,
                        },
                        grids: [],
                    },
                },
                quantity: 1,
            },
        ] as unknown as Product[];

        const result = getReplenishmentTotals(PRODUCTS);

        expect(result).toEqual({
            totalExclVat: 27,
            totalVat: 5.4,
            totalInclVat: 32.4,
        });
    });

    it('should calculate totals when quantity is more than one', () => {
        const PRODUCTS = [
            {
                selectedPackaging: {
                    price: {
                        amount: {
                            value: 150,
                            precision: 1,
                        },
                        vat_rate: {
                            value: 200,
                            precision: 1,
                        },
                        grids: [],
                    },
                },
                quantity: 10,
            },
            {
                selectedPackaging: {
                    price: {
                        amount: {
                            value: 150,
                            precision: 1,
                        },
                        vat_rate: {
                            value: 200,
                            precision: 1,
                        },
                        grids: [
                            {
                                max: {
                                    value: 50,
                                    precision: 1,
                                },
                                min: {
                                    value: 10,
                                    precision: 1,
                                },
                                amount: {
                                    value: 120,
                                    precision: 1,
                                },
                            },
                            {
                                max: {
                                    value: 150,
                                    precision: 1,
                                },
                                min: {
                                    value: 60,
                                    precision: 1,
                                },
                                amount: {
                                    value: 805,
                                    precision: 1,
                                },
                            },
                        ],
                    },
                },
                quantity: 1,
            },
        ] as unknown as Product[];

        const result = getReplenishmentTotals(PRODUCTS);

        expect(result).toEqual({
            totalExclVat: 162,
            totalVat: 32.4,
            totalInclVat: 194.4,
        });
    });
});

describe('getReceptionMax function', () => {
    it('should calculate max number', () => {
        expect(
            getReceptionMax({ received: 0, damaged: 0, missing: 0 } as ReceptionQuantitiesById[string], 10, 'received'),
        ).toBe(10);
        expect(
            getReceptionMax({ received: 4, damaged: 0, missing: 0 } as ReceptionQuantitiesById[string], 10, 'received'),
        ).toBe(10);
        expect(
            getReceptionMax({ received: 4, damaged: 2, missing: 0 } as ReceptionQuantitiesById[string], 10, 'received'),
        ).toBe(8);
        expect(
            getReceptionMax({ received: 0, damaged: 3, missing: 1 } as ReceptionQuantitiesById[string], 10, 'received'),
        ).toBe(6);
        expect(
            getReceptionMax({ received: 9, damaged: 1, missing: 1 } as ReceptionQuantitiesById[string], 10, 'received'),
        ).toBe(8);
    });
});
