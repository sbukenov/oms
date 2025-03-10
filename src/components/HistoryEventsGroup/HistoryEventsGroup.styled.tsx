import { antPrefix, Color } from '@bo/component-library';
import styled from 'styled-components';
import { HistoryEventIdTypes } from '~/models';

export const EventGroupRoot = styled.div`
    h4 {
        margin-bottom: 20px;
    }

    & > .${antPrefix}-typography {
        font-size: 14px;
        font-weight: 600;
        color: ${Color.neutral(5)};
    }

    .${antPrefix}-timeline-item-last {
        padding-bottom: 0;
    }

    .${antPrefix}-timeline-item-head {
        display: flex;
        padding-top: 0;
    }

    .${antPrefix}-timeline-item-tail {
        border-left: 2px solid ${Color.neutral(3)};
    }

    .${antPrefix}-timeline-item-content {
        display: flex;

        .${antPrefix}-typography {
            flex: 1;
            font-size: 14px;
            font-weight: 400;
            color: ${Color.neutral(8)};
        }
    }
`;

export const EventTime = styled.span`
    color: ${Color.neutral(5)};
    font-size: 14px;
    margin-left: 18px;
`;

const DOT_COLORS_MAP: Record<HistoryEventIdTypes, string> = {
    [HistoryEventIdTypes.OrderStatusChanged]: Color.valid(6),
    [HistoryEventIdTypes.OrderCancelled]: Color.error(6),
    [HistoryEventIdTypes.OrderFulfillmentStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.OrderShipmentStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.OrderCommentCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.OrderCommentUpdated]: Color.warning(5),
    [HistoryEventIdTypes.OrderCommentDeleted]: Color.error(6),
    [HistoryEventIdTypes.FulfillmentCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.FulfillmentStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.FulfillmentCancelled]: Color.error(6),
    [HistoryEventIdTypes.ShipmentCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.ShipmentStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.ShipmentCancelled]: Color.error(6),
    [HistoryEventIdTypes.OrderShippingAddressUpdated]: Color.royal_blue(6),
    [HistoryEventIdTypes.OrderReturnCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.OrderReturnStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.OrderReturnCancelled]: Color.error(6),
    [HistoryEventIdTypes.OrderBillingAddressUpdated]: Color.royal_blue(6),
    [HistoryEventIdTypes.OrderLineUpdated]: Color.warning(5),
    [HistoryEventIdTypes.TransactionCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.TransactionStatusChanged]: Color.warning(5),
    [HistoryEventIdTypes.TransactionCancelled]: Color.error(6),
    [HistoryEventIdTypes.ExpeditionCreated]: Color.royal_blue(6),
    [HistoryEventIdTypes.ReceptionCreated]: Color.royal_blue(6),
};

export const EventDot = styled.span<{ event_type: HistoryEventIdTypes }>`
    height: 8px;
    width: 8px;
    background-color: ${({ event_type }) => DOT_COLORS_MAP[event_type] || 'transparent'};
    display: inline-block;
    border-radius: 50%;
`;
