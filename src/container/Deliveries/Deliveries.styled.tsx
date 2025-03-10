import { antPrefix } from '@bo/component-library';
import Space from 'antd/lib/space';
import styled from 'styled-components';

export const ControlRow = styled(Space)`
    width: 100%;
    .${antPrefix}-input-affix-wrapper {
        width: 350px;
    }

    .${antPrefix}-space-item {
        :last-child {
            margin-left: auto;
        }
    }
`;
