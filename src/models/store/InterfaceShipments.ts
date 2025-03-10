import type { OrderShipment } from '../InterfaceShipment';
import type { Shipment } from '../InterfaceShipment';

export interface ShipmentsStore {
    orderShipments: {
        loading: boolean;
        orderId?: string;
        shipments: OrderShipment[];
        isApplyingTransition: boolean;
    };
    table: {
        shipments: Shipment[];
        loading: boolean;
        headers: {
            next?: string;
            prev?: string;
        };
        search: string;
        filters: Record<string, any>;
        route?: string;
    };
    isCreatingShipment?: boolean;
}
