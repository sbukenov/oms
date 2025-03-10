import { antPrefix } from '@bo/component-library';
import Modal from 'antd/lib/modal';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
    padding: 0;
    margin: 0 40px;
    width: auto !important;
    .${antPrefix}-modal-body {
        padding: 24px 32px;
        min-height: 70vh;
    }
`;
