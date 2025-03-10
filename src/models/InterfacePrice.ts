export interface PriceWithCurrency extends Price {
    language?: string;
    currency?: string;
}

export interface Price {
    value: number;
    precision: number;
}
