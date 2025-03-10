import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import React from 'react';
import { Icon } from '@bo/component-library';

import { CollapseRoot } from './CollapsibleInputGroup.styled';

interface CollapsiblePanelProps {
    title: string | React.ReactNode;
}

const ExpandIcon = () => <Icon name="chevron-down" size="sm" />;

export const CollapsibleInputGroup: React.FC<CollapsiblePanelProps> = ({ children, title }) => {
    return (
        <CollapseRoot defaultActiveKey={['1']} expandIcon={ExpandIcon}>
            <CollapsePanel header={title} key="1">
                <>{children}</>
            </CollapsePanel>
        </CollapseRoot>
    );
};
