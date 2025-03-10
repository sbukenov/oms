import { antPrefix, Color } from '@-bo/component-library';
import Modal from 'antd/lib/modal';
import Typography from 'antd/lib/typography';
import styled from 'styled-components';

export const ModalStyled = styled(Modal)`
    width: 660px !important;

    .${antPrefix}-form-item-row {
        display: flex;
        flex-direction: column;
        margin-right: 0;
        margin-left: 0;
    }

    .${antPrefix}-form-item-label {
        label {
            display: flex;
            height: 16px;
            margin-bottom: 4px;
        }
    }

    .form-footer {
        margin: 0;
        padding: 0;
    }
`;

export const InformationLine = styled(Typography.Text)`
    color: ${Color.neutral(8)};
    font-size: 14px;
    display: block;
    margin-bottom: 26px;
`;
