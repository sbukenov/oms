import { Entity } from '@bo/utils';

export const ENTITY_MOCK: Entity = {
    id: 1,
    uuid: 'fe11016d-94a5-11e8-b830-0242ac140001',
    configuration_model: null,
    depth: 1,
    distance: null,
    latlong: null,
    _pay_id: '896c6153-794e-3e94-b62d-95997c8b60ad',
    external_id: '7086',
    name: ' Shop',
    slug: '-shop',
    label: 'Entité Maitre',
    company_name: null,
    description: null,
    town: 'Paris',
    zipcode: '75002',
    address: ' Rue Palais Royal',
    address_additional: null,
    entity_address: {
        id: 13,
        uuid: '000c12d0-4702-4edf-b023-d6af0a863c28',
        address_inline: 'Rue Palais Royal 15',
        entrance_code: null,
        floor: null,
        door: null,
        complement: null,
        street_number: null,
        street_name: 'Rue Palais Royal',
        postal_code: '75002',
        city: 'Paris',
        country: {
            id: 1,
            uuid: '21bfe6ab-7923-11e8-a9cd-0242ac120004',
        },
        region: null,
        county: null,
        telephone: '+33 6 12 45 87 45',
        fax: null,
        mail: null,
        default_label: null,
        firstname: null,
        lastname: null,
        honorific_prefix: null,
        longitude: '2.39448834980581',
        latitude: '48.813542157758995',
        district: null,
        vat_number: null,
        company_name: null,
    },
    phone: '+33 6 12 45 87 45',
    mail: null,
    website: null,
    photo: null,
    logo: null,
    capital: null,
    code_rcs: null,
    code_siret: '1234567890',
    code_siren: null,
    code_ape: null,
    vat_number: '1234567890',
    legal_form: null,
    ticket_bottom_url: null,
    ticket_bottom_text: null,
    late_payment_penalties: null,
    discount_conditions: null,
    latitude: '48.813542157758995',
    longitude: '2.39448834980581',
    created_at: '2023-05-03T12:30:32+02:00',
    updated_at: '2023-05-05T11:10:53+02:00',
    is_visible: true,
    is_active: true,
    created_by: null,
    extrafields: null,
    tags: [],
    destinations: [],
    parent: null,
    headquarter_address: null,
    country: {
        id: 1,
        uuid: '21bfe6ab-7923-11e8-a9cd-0242ac120004',
    },
    currency: {
        iso_code: 'EUR',
        uuid: '1320164c-7925-11e8-a9cd-0242ac120004',
        label: 'Euro Member Countries',
        unicode: '€',
        active: true,
    },
    config: {
        uuid: 'bae7b7d5-c41a-495c-83df-7023b4c4e76b',
        has_stock_management: false,
        has_negative_stock_sales: false,
        has_customer_sharing: false,
        is_table_service: false,
        is_catering: false,
        credit_note_text: null,
        credit_note_expiration_days: 30,
        is_retail: false,
        active_customers_returns_reason: false,
        active_comment_customers_returns_reason: false,
    },
    is_product_substitution_active: false,
    type: 'RETAIL',
    apply_date: null,
    is_applied: false,
    is_template: false,
    sales_barcode: true,
    timezone: null,
    destination_bank_information: null,
};
