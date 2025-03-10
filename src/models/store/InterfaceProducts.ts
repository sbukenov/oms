import type { Product } from '../InterfaceProducts';
import { Items } from '../InterfaceNormalize';

export interface ProductsStore {
    loading: boolean;
    products: Product[];
    allProductsByUuid: Items<Product>;
    next?: string;
    prev?: string;
}
