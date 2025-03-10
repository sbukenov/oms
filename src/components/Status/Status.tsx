import React from 'react';
import Badge from 'antd/lib/badge';

import type { StatusGroups, StatusCodes } from '~/models';
import { useStatusInfo } from '~/hooks';
import { DEFAULT_DASH } from '~/const/configuration/common';

interface StatusProps {
    group: StatusGroups;
    code?: StatusCodes;
    className?: string;
}

export const Status: React.FC<StatusProps> = ({ className, group, code }) => {
    const { statusLabel, statusColor } = useStatusInfo(group, code);

    if (!code) {
        return <span className={className}>{DEFAULT_DASH}</span>;
    }

    return <Badge className={className} color={statusColor} text={statusLabel} />;
};
