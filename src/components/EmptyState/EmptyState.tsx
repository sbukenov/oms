import React from 'react';
import { Empty, Typography } from 'antd';

import { CenteredContainer } from './EmptyState.styled';

interface EmptyStateProps {
    title: string;
    subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => (
    <CenteredContainer>
        <Empty
            description={
                <div>
                    <Typography.Title level={4}>{title}</Typography.Title>
                    <Typography.Text>{subtitle}</Typography.Text>
                </div>
            }
        />
    </CenteredContainer>
);
