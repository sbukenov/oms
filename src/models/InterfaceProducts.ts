import type { Price, Owner, Grid, Headers } from '@bo/utils';

export interface PackagingCondition {
    business_units: { id: string; label: string; url: string }[];
    delivery_delay: number;
    enabled: boolean;
    id: string;
    min_quantity: number;
    price: {
        amount: Price;
        vat_rate: Price;
        grids: Grid[];
    };
}

export interface Packaging {
    id: string;
    label: string;
    attributes: Record<string, string>;
    packaging_per_pallet: number;
    pim_uuid: string | null;
    product_per_packaging: number;
    reference: string | null;
    owner: Owner;
    packaging_product?: {
        attributes: Record<string, any>;
        barcode: string;
        image_url: string;
        label: string;
        pim_uuid: string;
    };
    min_quantity: number;
    packaging_conditions: PackagingCondition[] | Record<number, PackagingCondition>;
    price?: {
        amount: Price;
        vat_rate: Price;
        grids: Grid[];
    };
    // just FE properties
    isChosen?: boolean;
}

export interface ProductInformation {
    attributes: [];
    barcode: string;
    image_url: string | null;
    label: string;
    pim_uuid: string;
}

export interface Product {
    packagings: Packaging[];
    product: ProductInformation;
    // just FE properties
    quantity?: number;
    amount_excluding_vat?: Price;
    amount_including_vat?: Price;
    unit_price_excluding_vat?: Price;
    unit_price_including_vat?: Price;
    vat_amount?: Price;
    selectedPackaging?: Packaging;
}

export interface GetProductsSuccessPayload {
    data: {
        products: Product[];
    };
    headers: Headers;
}
