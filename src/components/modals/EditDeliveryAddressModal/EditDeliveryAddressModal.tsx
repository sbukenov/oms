import { Alert } from '@-bo/component-library';
import Button from 'antd/lib/button';
import Form, { Rule } from 'antd/lib/form';
import Input from 'antd/lib/input';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { preventEmptySpaces } from '@-bo/utils';

import { useActions } from '~/hooks';
import { OrderFull } from '~/models';
import { selectLoadingOrder } from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import { normalizeCountryCode, showSuccessNotification } from '~/utils';

import { ModalStyled, InformationLine } from './EditDeliveryAddressModal.styled';

interface EditDeliveryAddressModalProps {
    close: () => void;
    order: OrderFull;
}

export const EditDeliveryAddressModal: FC<EditDeliveryAddressModalProps> = ({ close, order }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { isFieldsTouched, getFieldsError } = form;
    const loading = useSelector(selectLoadingOrder);
    const { editShippingAddress } = useActions(orderDetailsActions);

    const { maxLengthRule, requiredRule, emailRule, countryCodeRule, postalCodeRule, phonePatternRule } = useMemo<
        Record<string, Rule>
    >(
        () => ({
            maxLenghtRule: { max: 200, message: t('errors.incorrect_value_length', { length: 200 }) },
            requiredRule: { required: true },
            emailRule: { type: 'email', message: t('errors.incorrect_email') },
            countryCodeRule: { max: 3, message: t('errors.incorrect_value_length', { length: 3 }) },
            postalCodeRule: { max: 20, message: t('errors.incorrect_value_length', { length: 20 }) },
            phonePatternRule: {
                pattern: /^\+(?:[0-9] ?){6,11}[0-9]$/,
                message: t('errors.incorrect_international_phone_number'),
            },
        }),
        [t],
    );

    const onFinish = useCallback(
        (values) => {
            const onSuccess = () => {
                close();
                showSuccessNotification({
                    message: t('common.success'),
                    description: t('notifications.delivery_address_updated'),
                });
            };

            editShippingAddress({ values, onSuccess, orderId: order.id });
        },
        [close, editShippingAddress, order.id, t],
    );

    const confirmCancel = useCallback(() => {
        if (!isFieldsTouched()) {
            return close();
        }
        Alert.confirm({
            title: t('modals.edit_shipping_address.quit_editing'),
            content: t('modals.edit_shipping_address.changes_not_saved'),
            okText: t('common.yes_quit'),
            cancelText: t('common.go_back'),
            onOk: close,
        });
    }, [close, isFieldsTouched, t]);

    const shouldDisableSumit = useCallback(() => {
        const fieldsNotTouched = !isFieldsTouched();
        const hasErrors = !!getFieldsError().filter(({ errors }) => errors.length).length;

        return fieldsNotTouched || hasErrors;
    }, [getFieldsError, isFieldsTouched]);

    return (
        <Form form={form} layout="vertical" initialValues={order.shipping_address} onFinish={onFinish}>
            <ModalStyled
                visible
                onCancel={confirmCancel}
                title={t('modals.edit_shipping_address.title')}
                footer={
                    <Form.Item shouldUpdate className="form-footer">
                        {() => (
                            <>
                                <Button onClick={confirmCancel}>{t('common.cancel')}</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={shouldDisableSumit()}
                                    onClick={form.submit}
                                >
                                    {t('common.save')}
                                </Button>
                            </>
                        )}
                    </Form.Item>
                }
            >
                <InformationLine>{t('modals.edit_shipping_address.make_changes')}</InformationLine>
                <Form.Item
                    label={t('modals.edit_shipping_address.name')}
                    name="name"
                    rules={[maxLengthRule, requiredRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input required />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.address_line', { count: 1 })}
                    name="line_1"
                    rules={[maxLengthRule, requiredRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input required />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.address_line', { count: 2 })}
                    name="line_2"
                    rules={[maxLengthRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.address_line', { count: 3 })}
                    name="line_3"
                    rules={[maxLengthRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.postal_code')}
                    name="postal_code"
                    rules={[requiredRule, postalCodeRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input required />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.city')}
                    name="city"
                    rules={[maxLengthRule, requiredRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.country')}
                    name="country_code"
                    rules={[requiredRule, countryCodeRule]}
                    normalize={normalizeCountryCode}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.email')}
                    name="email"
                    rules={[emailRule, maxLengthRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.phone_number')}
                    name="phone"
                    rules={[phonePatternRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.address_comment')}
                    name="comment"
                    rules={[maxLengthRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('modals.edit_shipping_address.type')}
                    name="type"
                    rules={[maxLengthRule]}
                    normalize={preventEmptySpaces}
                >
                    <Input />
                </Form.Item>
            </ModalStyled>
        </Form>
    );
};
