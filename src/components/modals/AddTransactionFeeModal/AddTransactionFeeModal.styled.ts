import { antPrefix } from '@bo/component-library';
import Modal from 'antd/lib/modal';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
    width: 660px !important;

    .${antPrefix}-modal-body {
        border-radius: 8px;
        padding: 32px 32px 16px 32px;
    }
    .${antPrefix}-typography {
        margin: 8px 0 32px 0;
        display: block;
    }
    .${antPrefix}-row {
        margin: 0;
    }
    .${antPrefix}-form-item:last-child {
        padding: 0;
        border-top: 1px solid #e9eaec;
        margin: 0 -32px;
    }
    .${antPrefix}-input-number {
        width: 100% !important;
    }
`;

export const StyledModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 32px;
    padding-top: 16px;

    button {
        margin-left: 16px;
    }
`;
