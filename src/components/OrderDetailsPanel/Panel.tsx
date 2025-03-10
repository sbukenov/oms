import React, { PropsWithChildren } from 'react';
import Typography from 'antd/lib/typography';

import { DetailsPanelBody, DetailsPanelContainer, DetailsPanelHeader } from './Panel.styled';

export type OrderPanelProps = PropsWithChildren<{
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}>;

export const OrderPanel: React.FC<OrderPanelProps> = ({ title, subtitle, children }) => {
    return (
        <DetailsPanelContainer>
            <DetailsPanelHeader>
                <Typography.Title level={5}>{title}</Typography.Title>
                {!!subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
            </DetailsPanelHeader>
            <DetailsPanelBody>{children}</DetailsPanelBody>
        </DetailsPanelContainer>
    );
};
