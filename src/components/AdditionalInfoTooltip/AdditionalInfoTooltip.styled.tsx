import { Color } from '@bo/component-library';
import Button, { ButtonProps } from 'antd/lib/button';
import type { CSSProperties, FC } from 'react';
import styled from 'styled-components';

export const StyledOverlay = styled.div`
    background: ${Color.neutral(1)};
    padding: 24px 16px;
    border-radius: 8px;
    max-height: 360px;
    overflow-y: scroll;
`;

export const overlayInnerStyle: CSSProperties = { background: Color.neutral(1), padding: 0, width: 295 };

export const StyledTooltipButton = styled<FC<ButtonProps>>(Button)`
    padding: 0;
`;
