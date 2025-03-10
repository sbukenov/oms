import { Price } from '@-bo/utils';
import { Items } from '../InterfaceNormalize';
import { Product } from '../InterfaceProducts';

export interface SupplierConditions {
    created_at: string;
    delivery_days?: number[];
    delivery_delay?: number;
    id: string;
    // 1 - Monday, 2 - Tuesday, ..., 7 - Sunday
    order_days?: number[];
    owner: { id: string; label: string; url: string };
    same_day_order_deadline?: string;
    updated_at: string;
    min_amount: Price | null;
}

export interface OrderCreationStore {
    supplierConditions?: SupplierConditions;
    supplierConditionsLoading?: boolean;
    isSuppliersLoading: boolean;
    supplier?: string;
    suppliers: SupplierConditions[];
    nextSuppliers?: string;
    productsByUuid: Items<Product>;
    isUpdating: boolean;
}

export interface GetSupplierConditionsResponse {
    replenishment_conditions: SupplierConditions[];
}
