import styled from 'styled-components';
import Timeline, { TimelineProps } from 'antd/lib/timeline';
import { Color } from '@bo/component-library';

export const LoadingStyled = styled.div`
    color: ${Color.neutral(6)};
    margin-left: 16px;
`;

export const ScrollableContainer = styled.div`
    height: 330px;
    overflow-y: auto;
`;

export const EventDot = styled.span`
    height: 8px;
    width: 8px;
    background-color: ${Color.warning(5)};
    display: inline-block;
    border-radius: 50%;
`;

export const TimelineStyled = styled<React.FC<TimelineProps>>(Timeline)`
    margin-top: 20px;
`;
