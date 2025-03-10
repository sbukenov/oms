import React, { FC, useCallback, useMemo } from 'react';
import Form from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input/Input';
import Text from 'antd/lib/typography/Text';
import { StyledFormItem } from '@-bo/keystone-components';
import { useSelector } from 'react-redux';
import {
    getRawAmountValue,
    DEFAULT_CURRENCY,
    preventSigns,
    CustomActionConfigurationShort,
    CustomActionData,
} from '@-bo/utils';
import isEqual from 'lodash/isEqual';

import { calculateValueAndPrecision, getAmoundValidationRules } from '~/utils';
import { StyledInputNumber } from '~/style/commonStyle';
import { AmountModeSwitch } from '~/components';
import { transactionsActions } from '~/redux/slices';
import { selectIsApplyingAction } from '~/redux/selectors';
import { useActions } from '~/hooks';
import { TransactionMode } from '~/models';
import { REQUIRED_RULE } from '~/const';

import { StyledModal, StyledModalFooter } from './EditTransactionFeeModal.styled';

type FormType = {
    label: string;
    amount: number;
};

interface EditTransactionFeeModalProps {
    close: () => void;
    selectedAction: CustomActionConfigurationShort;
    data: CustomActionData;
}

export const EditTransactionFeeModal: FC<EditTransactionFeeModalProps> = ({ close, selectedAction, data }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormType>();
    const { getFieldsError, getFieldsValue, setFieldValue } = form;
    const mode = Form.useWatch('mode', form);
    const isApplyingAction = useSelector(selectIsApplyingAction);
    const { updateTransactionFee } = useActions(transactionsActions);

    const currency = data?.transaction?.currency || DEFAULT_CURRENCY;

    const onFinish = useCallback(
        (values: FormType) => {
            if (!data.transaction || !data.line) return;

            let amount = calculateValueAndPrecision(values.amount.toString());

            if (mode === TransactionMode.add) {
                amount.value = amount.value * -1;
            }

            updateTransactionFee({
                onSuccess: close,
                transactionId: data.transaction.id,
                feeId: data.line.id,
                values: {
                    label: values.label,
                    amount,
                },
            });
        },
        [close, data.line, data.transaction, mode, updateTransactionFee],
    );

    const changeMode = useCallback((value: TransactionMode) => setFieldValue('mode', value), [setFieldValue]);

    const initialValues = useMemo(() => {
        if (!data.line) return;

        const amount = getRawAmountValue(data.line.amount);

        return {
            label: data.line.label,
            amount: Math.abs(amount),
            mode: amount >= 0 ? TransactionMode.subtract : TransactionMode.add,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shouldDisableSubmit = useCallback(() => {
        if (isEqual(initialValues, getFieldsValue())) return true;

        return !!getFieldsError().filter(({ errors }) => errors.length).length;
    }, [getFieldsError, getFieldsValue, initialValues]);

    return (
        <StyledModal visible title={selectedAction.label} footer={null} onCancel={close}>
            <Text>{t('modals.edit_fee.edit_information')}</Text>
            <Form form={form} initialValues={initialValues} layout="vertical" onFinish={onFinish}>
                <StyledFormItem label={t('common.label')} name="label" required rules={REQUIRED_RULE}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem label={t('common.mode')} name="mode" required>
                    <AmountModeSwitch mode={mode} changeMode={changeMode} />
                </StyledFormItem>
                <StyledFormItem
                    label={`${t('common.amount')} ${currency}`}
                    name="amount"
                    required
                    rules={getAmoundValidationRules(t)}
                >
                    <StyledInputNumber type="number" onKeyDown={preventSigns} />
                </StyledFormItem>
                <StyledFormItem shouldUpdate>
                    {() => (
                        <StyledModalFooter>
                            <Button type="link" loading={isApplyingAction} onClick={close}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isApplyingAction}
                                disabled={shouldDisableSubmit()}
                            >
                                {t('common.save')}
                            </Button>
                        </StyledModalFooter>
                    )}
                </StyledFormItem>
            </Form>
        </StyledModal>
    );
};
