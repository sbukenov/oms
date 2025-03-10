import { Collapse } from 'antd';
import React from 'react';

import { CollapseRoot } from './CollapsiblePanel.styled';

interface CollapsiblePanelProps {
    title: string | React.ReactNode;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({ children, title }) => {
    return (
        <CollapseRoot defaultActiveKey={['1']}>
            <Collapse.Panel header={title} key="1">
                <>{children}</>
            </Collapse.Panel>
        </CollapseRoot>
    );
};
