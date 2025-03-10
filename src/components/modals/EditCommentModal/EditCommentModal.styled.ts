import styled from 'styled-components';
import Modal from 'antd/lib/modal';
import { antPrefix, Color } from '@bo/component-library';

export const ModalRoot = styled(Modal)`
    width: 660px !important;
    height: 496px;

    .${antPrefix}-modal-title {
        font-size: 20px;
    }

    .${antPrefix}-modal-header {
        border-bottom: none;
    }

    .${antPrefix}-modal-body {
        padding-bottom: 0;
        border-radius: 0 0 8px 8px;
    }

    .${antPrefix}-typography {
        color: ${Color.neutral(8)};
        font-size: 14px;
        margin-bottom: 32px;
    }

    .form-footer {
        .${antPrefix}-form-item-control-input-content {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            & > button[type='submit'] {
                margin-left: 16px;

                &:disabled {
                    background: ${Color.secondary(6)};
                    color: white;
                    opacity: 0.2;
                }
            }
        }
    }
`;
