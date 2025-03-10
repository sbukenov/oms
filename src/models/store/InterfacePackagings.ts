import type { Packaging } from '../InterfaceProducts';

export interface PackagingsStore {
    loading: boolean;
    packagings: Packaging[];
    next?: string;
}

export interface GetPackagingsResponse {
    packaging_lines: Packaging[];
}
