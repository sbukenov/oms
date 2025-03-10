import React from 'react';
import { Color, Icon } from '@bo/component-library';
import notification from 'antd/lib/notification';

export const showErrorNotification = (error: any) => {
    const message = error.originalError?.response?.data?.message || error.message || '';
    const description = error.originalError?.response?.data?.description || error.description || '';

    notification.error({
        description,
        message,
        icon: <Icon type="system-feedback-error" style={{ color: Color.error(6), fontSize: 14 }} />,
        className: 'custom-notification',
        placement: 'bottomRight',
    });
};

export const showSuccessNotification = (event: { description: string; message: string }) => {
    notification.success({
        description: event.description,
        message: event.message,
        icon: <Icon type="status-check" style={{ fontSize: 12 }} />,
        className: 'custom-notification',
        placement: 'bottomRight',
    });
};
