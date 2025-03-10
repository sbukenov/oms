import React, { FC, useCallback, useMemo } from 'react';
import Table, { ColumnProps } from 'antd/lib/table';
import Form from 'antd/lib/form';
// import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Paragraph from 'antd/lib/typography/Paragraph';
import { StyledFormItem } from '@-bo/keystone-components';
import { CustomActionConfigurationShort } from '@-bo/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@-bo/component-library';
import { useSelector } from 'react-redux';

import { ShipmentShort, Transition } from '~/models';
import { useActions } from '~/hooks';
import { shipmentsActions } from '~/redux/slices';
import { showReference } from '~/utils';
import { Status } from '~/components';
import { selectOrderShipments } from '~/redux/selectors';

import { StyledModal, StyledReference } from './ShipmentHandOverModal.styled';

type FormType = { pickup_code: string };

interface ShipmentHandOverModalProps {
    shipment: ShipmentShort;
    selectedAction: CustomActionConfigurationShort;
    close: () => void;
}

export const ShipmentHandOverModal: FC<ShipmentHandOverModalProps> = ({ shipment, selectedAction, close }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormType>();
    const { getFieldsError, setFields } = form;
    const { isApplyingTransition } = useSelector(selectOrderShipments);
    const { applyShipmentTransition } = useActions(shipmentsActions);

    const columns: ColumnProps<ShipmentShort>[] = useMemo(
        () => [
            {
                title: t('common.delivery'),
                dataIndex: 'reference',
                width: '33%',
                render: (value) => <StyledReference>{showReference(value)}</StyledReference>,
            },
            {
                title: t('modals.shipment_hand_over.shipped_from'),
                dataIndex: ['issuer', 'label'],
                width: '33%',
            },
            {
                title: t('common.status'),
                dataIndex: 'status',
                width: '33%',
                render: (value) => <Status group="shipment" code={value} />,
            },
        ],
        [t],
    );

    const dataSource = useMemo(() => [shipment], [shipment]);

    // const rules = useMemo(
    //     () => [
    //         {
    //             required: true,
    //             message: t('errors.code_mandatory'),
    //         },
    //         {
    //             pattern: new RegExp('\\b[0-9]{4}\\b'),
    //             message: t('errors.code_length'),
    //         },
    //     ],
    //     [t],
    // );

    const onError = useCallback(() => {
        // TODO: Request errors array from backend team
        setFields([
            {
                name: 'pickup_code',
                errors: [''],
            },
        ]);
    }, [setFields]);

    const onFinish = useCallback(
        (values: FormType) => {
            applyShipmentTransition({
                id: shipment.id,
                pickup_code: values.pickup_code,
                transition: Transition.complete,
                onError,
                onSuccess: close,
            });
        },
        [applyShipmentTransition, close, onError, shipment.id],
    );

    const shouldDisableSubmit = useCallback(() => {
        return !!getFieldsError().filter(({ errors }) => errors.length).length;
    }, [getFieldsError]);

    return (
        <StyledModal
            visible
            title={selectedAction.label}
            footer={null}
            onCancel={close}
            destroyOnClose
            closeIcon={<Icon name="close" size="sm" />}
        >
            <Paragraph>{t('modals.shipment_hand_over.enter_code')}</Paragraph>
            <Table columns={columns} dataSource={dataSource} pagination={false} />
            <Form form={form} onFinish={onFinish}>
                {/* <StyledFormItem
                    label={t('modals.shipment_hand_over.input.label')}
                    required
                    name="pickup_code"
                    rules={rules}
                >
                    <Input placeholder={t('common.enter')} />
                </StyledFormItem> */}
                <StyledFormItem className="action-footer" shouldUpdate>
                    {() => (
                        <>
                            <Button type="link" onClick={close}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={shouldDisableSubmit()}
                                loading={isApplyingTransition}
                            >
                                {t('common.validate')}
                            </Button>
                        </>
                    )}
                </StyledFormItem>
            </Form>
        </StyledModal>
    );
};
