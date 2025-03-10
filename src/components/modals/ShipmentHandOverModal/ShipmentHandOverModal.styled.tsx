import styled from 'styled-components';
import Modal from 'antd/lib/modal';
import { antPrefix, Color } from 'component-library';

export const StyledModal = styled(Modal)`
    width: 660px !important;

    .${antPrefix}-modal-header {
        border-radius: 4px;
        border-bottom: none;
        height: 72px;
    }

    .${antPrefix}-modal-body {
        border-radius: 4px;
        padding-bottom: 0;
        padding-top: 40px;
        background-color: #f3f3f3;
    }

    .${antPrefix}-row {
        margin: 0;
    }

    .${antPrefix}-table-wrapper {
        margin-top: 24px;
        margin-bottom: 24px;
        box-shadow: 0px 4px 6px rgba(88, 115, 181, 0.05), 0px 1px 2px rgba(88, 115, 181, 0.1);
    }

    .action-footer {
        margin-left: -32px;
        margin-right: -32px;
        margin-bottom: 0;
        margin-top: 32px;
        padding-bottom: 0 !important;
        padding-left: 32px;
        padding-right: 32px;
        height: 72px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-color: ${Color.neutral(2)};

        button {
            margin-left: 16px;
        }
    }
`;

export const StyledReference = styled.div`
    background-color: #f0f2f8;
    color: ${Color.primary(6)};
    padding: 8px;
    height: 32px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 4px;
    width: fit-content;
`;
