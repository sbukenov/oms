import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Timeline from 'antd/lib/timeline';
import Typography from 'antd/lib/typography';
import dayjs from 'dayjs';

import {
    FULL_MONTH_NAME_DATE_FORMAT,
    HOUR_MINUTE_TIME_FORMAT,
    STATUSES,
    QA_ORDER_HISTORY_DATE,
    QA_ORDER_HISTORY_LINE,
} from '~/const';
import type { OrderHistoryEvent } from '~/models';
import { createChangeLogText } from '~/utils/helpers';
import { getModuleContext } from '~/utils/context';

import { EventDot, EventGroupRoot, EventTime } from './HistoryEventsGroup.styled';

export interface HistoryEventsGroupProps {
    date: string;
    groupIndex: number;
    events: OrderHistoryEvent[];
}

export const HistoryEventsGroup: FC<HistoryEventsGroupProps> = ({ groupIndex, date, events }) => {
    const { t } = useTranslation();
    const { config } = useContext(getModuleContext());
    const dateLabel = useMemo(() => {
        const dateDayJs = dayjs(date);
        const dateFormatted = dateDayJs.format(FULL_MONTH_NAME_DATE_FORMAT);

        if (dateDayJs.isToday()) {
            return `${t('common.today')}, ${dateFormatted}`;
        }

        if (dateDayJs.isYesterday()) {
            return `${t('common.yesterday')}, ${dateFormatted}`;
        }

        return dateFormatted;
    }, [date, t]);

    return (
        <EventGroupRoot data-testid={`history-events-${date}`}>
            <Typography.Title className={`${QA_ORDER_HISTORY_DATE}${groupIndex}`} level={4}>
                {dateLabel}
            </Typography.Title>
            <Timeline data-testid={`history-events-${date}-list`}>
                {events.map((event, index) => (
                    <Timeline.Item
                        className={`${QA_ORDER_HISTORY_LINE}${groupIndex}${index}`}
                        key={event.id}
                        dot={<EventDot event_type={event.event_id} />}
                    >
                        <Typography.Text>
                            {createChangeLogText(event, config?.specific?.statuses || STATUSES)}
                        </Typography.Text>
                        <EventTime>{dayjs(event.created_at).format(HOUR_MINUTE_TIME_FORMAT)}</EventTime>
                    </Timeline.Item>
                ))}
            </Timeline>
        </EventGroupRoot>
    );
};
