import { mapHistoryByDay, mapFilters, dateKeys, mapLogisticUnitsData } from '../mappers';
import type { OrderHistoryEvent } from '../../models';

describe('mapHistoryByDay function', () => {
    it('should handle empty input', () => {
        expect(mapHistoryByDay([])).toEqual([]);
    });

    it('should handle undefined input', () => {
        expect(mapHistoryByDay(undefined)).toEqual([]);
    });

    it('should group events by date', () => {
        const data = [
            {
                id: '1ece62d3-25b5-6fb6-b412-bbc048be16af',
                event_id: 'oms_core.order.status_changed',
                created_at: '2022-06-07T06:43:53Z',
            },
            {
                id: '1ece62d3-25af-6792-b5e1-bbc048be16af',
                event_id: 'oms_core.order.status_changed',
                created_at: '2022-06-07T06:43:53Z',
            },
            {
                id: '1ece62d2-5b5c-6dd2-947b-7d8fa3c5bece',
                event_id: 'oms_core.order.status_changed',
                created_at: '2022-06-05T06:43:32Z',
            },
            {
                id: '1ece62d2-36a8-6702-962f-fd953bfc56e0',
                event_id: 'oms_core.order_shipment_status.status_changed',
                created_at: '2022-06-05T06:43:28Z',
            },
            {
                id: '1ece62d1-e89a-66d2-a478-eb0506cc18bf',
                event_id: 'oms_core.order_shipment_status.status_changed',
                created_at: '2022-06-03T06:43:20Z',
            },
        ] as OrderHistoryEvent[]; // Assert type, cut object for better test readability

        const expected_result = [
            {
                date: '2022-06-07T06:43:53Z',
                data: [
                    {
                        id: '1ece62d3-25b5-6fb6-b412-bbc048be16af',
                        event_id: 'oms_core.order.status_changed',
                        created_at: '2022-06-07T06:43:53Z',
                    },
                    {
                        id: '1ece62d3-25af-6792-b5e1-bbc048be16af',
                        event_id: 'oms_core.order.status_changed',
                        created_at: '2022-06-07T06:43:53Z',
                    },
                ],
            },
            {
                date: '2022-06-05T06:43:32Z',
                data: [
                    {
                        id: '1ece62d2-5b5c-6dd2-947b-7d8fa3c5bece',
                        event_id: 'oms_core.order.status_changed',
                        created_at: '2022-06-05T06:43:32Z',
                    },
                    {
                        id: '1ece62d2-36a8-6702-962f-fd953bfc56e0',
                        event_id: 'oms_core.order_shipment_status.status_changed',
                        created_at: '2022-06-05T06:43:28Z',
                    },
                ],
            },
            {
                date: '2022-06-03T06:43:20Z',
                data: [
                    {
                        id: '1ece62d1-e89a-66d2-a478-eb0506cc18bf',
                        event_id: 'oms_core.order_shipment_status.status_changed',
                        created_at: '2022-06-03T06:43:20Z',
                    },
                ],
            },
        ];

        expect(mapHistoryByDay(data)).toEqual(expected_result);
    });
});

describe('mapFilters function', () => {
    it('should return object without fields that are undefined', () => {
        const data = { status: 'CREATED', owner: undefined, created_at: undefined };
        const expectedResult = { status: 'CREATED' };

        expect(mapFilters(data)).toEqual(expectedResult);
    });

    it('should handle date filter types', () => {
        const data = {
            created_at: ['2022-02-24T00:00:00Z', '2022-02-25T00:00:00Z'],
        };

        const [fromKey, toKey] = dateKeys['created_at'];

        expect(mapFilters(data)[fromKey]).toBeDefined();
        expect(mapFilters(data)[toKey]).toBeDefined();
    });
});

describe('mapLogisticUnitsData function', () => {
    it('should map result', () => {
        const quantities = {
            '1ee89bec-b4f7-6bf4-b2e5-1365682470e0': {
                price: 100.1,
                type: '',
                packaging: {
                    id: '1ee61c63-a18e-6244-aeb8-4b6c07dfbce5',
                    product_per_packaging: 20,
                    reference: 'box_10',
                    label: 'label_10',
                    product: {
                        pim_uuid: '2ab7d685-5d51-47bd-b5b3-c20cb4dff059',
                        label: 'Kinder country',
                        barcode: '123456789',
                        image_url: 'www.dummy-url.com',
                    },
                },
                quantity: 1,
            },
            '1ee89bec-b4f9-6134-876c-1365682470e0': {
                price: 100.1,
                type: '',
                packaging: {
                    id: '1ee61c54-36b2-64f2-bd67-01d56e0e1bf7',
                    product_per_packaging: 10,
                    reference: 'box_7',
                    label: 'label_7',
                    product: {
                        pim_uuid: 'edc9b1f4-6d1a-46d6-a1e6-f07cecb6ab28',
                        label: 'CLIMATISEUR_MOBILE_7000BTU_2050W_330M3_H_HEALLUX',
                        barcode: '123456789',
                        image_url: 'www.dummy-url.com',
                    },
                },
                quantity: 1,
            },
        };

        const expectedResult = {
            replenishment_operation: 'someUuid',
            logistic_units: [
                {
                    type: 'integrated',
                    price: { value: 1001, precision: 1 },
                    packaging: {
                        id: '1ee61c63-a18e-6244-aeb8-4b6c07dfbce5',
                        quantity: 1,
                        items: [
                            {
                                quantity: 1,
                                barcode: '123456789',
                            },
                        ],
                    },
                    logistic_unit_items: [
                        {
                            pim_uuid: '2ab7d685-5d51-47bd-b5b3-c20cb4dff059',
                            label: 'Kinder country',
                            barcode: '123456789',
                            image_url: 'www.dummy-url.com',
                            quantity: 20,
                        },
                    ],
                },
                {
                    type: 'integrated',
                    price: { value: 1001, precision: 1 },
                    packaging: {
                        id: '1ee61c54-36b2-64f2-bd67-01d56e0e1bf7',
                        quantity: 1,
                        items: [
                            {
                                quantity: 1,
                                barcode: '123456789',
                            },
                        ],
                    },
                    logistic_unit_items: [
                        {
                            pim_uuid: 'edc9b1f4-6d1a-46d6-a1e6-f07cecb6ab28',
                            label: 'CLIMATISEUR_MOBILE_7000BTU_2050W_330M3_H_HEALLUX',
                            barcode: '123456789',
                            image_url: 'www.dummy-url.com',
                            quantity: 10,
                        },
                    ],
                },
            ],
        };

        expect(mapLogisticUnitsData('someUuid', quantities)).toEqual(expectedResult);
    });

    it('should throw an error, when id is undefined', () => {
        expect(() => mapLogisticUnitsData(undefined, {})).toThrow();
    });
});
