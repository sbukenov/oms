import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Timeline from 'antd/lib/timeline';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IdParam } from '@bo/utils';

import { OrderPanel, HistoryEventsGroup } from '~/components';
import { SpinStyled } from '~/style/commonStyle';
import { useActions } from '~/hooks';
import { selectOrderDetails } from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import { mapHistoryByDay, hasNextHistoryPage } from '~/utils';
import { QA_ORDER_HISTORY_LINE } from '~/const';

import { EventDot, LoadingStyled, ScrollableContainer, TimelineStyled } from './HistoryPanel.styled';

export const OrderHistoryPanel = () => {
    const { t } = useTranslation();
    const { id } = useParams<IdParam>();

    const { loading, historyLoading, history } = useSelector(selectOrderDetails);
    const { getOrderHistory, loadNextOrderHistory } = useActions(orderDetailsActions);
    const historyGroupedByDate = useMemo(() => mapHistoryByDay(history.object_events), [history.object_events]);

    useEffect(() => {
        id && !history.object && getOrderHistory(id);
    }, [getOrderHistory, history, id]);

    const loadMoreHistory = useCallback(() => {
        loadNextOrderHistory();
    }, [loadNextOrderHistory]);

    // show spinning when we load only the history to avoid overlapping spinners
    const spinning = !loading && historyLoading;

    return (
        <SpinStyled spinning={spinning}>
            <OrderPanel title={t('order.history.title')}>
                <ScrollableContainer id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={history.object_events?.length || 0}
                        next={loadMoreHistory}
                        loader={<LoadingStyled>{t('common.loading')}</LoadingStyled>}
                        hasMore={hasNextHistoryPage(history.pagination)}
                        scrollableTarget="scrollableDiv"
                    >
                        {!historyGroupedByDate.length ? (
                            <TimelineStyled>
                                <Timeline.Item className={`${QA_ORDER_HISTORY_LINE}0`} dot={<EventDot />}>
                                    {t('order.history.no_events')}
                                </Timeline.Item>
                            </TimelineStyled>
                        ) : (
                            historyGroupedByDate.map((group, index) => (
                                <HistoryEventsGroup
                                    key={group.date}
                                    date={group.date}
                                    events={group.data}
                                    groupIndex={index}
                                />
                            ))
                        )}
                    </InfiniteScroll>
                </ScrollableContainer>
            </OrderPanel>
        </SpinStyled>
    );
};
