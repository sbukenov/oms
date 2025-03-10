import React, { FC, useCallback, useState } from 'react';
import Form from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input/Input';
import Text from 'antd/lib/typography/Text';
import { StyledFormItem } from '@bo/keystone-components';
import { useSelector } from 'react-redux';
import { CustomActionConfigurationShort, CustomActionData, DEFAULT_CURRENCY, preventSigns } from '@-bo/utils';

import { calculateValueAndPrecision, getAmoundValidationRules } from '~/utils';
import { StyledInputNumber } from '~/style/commonStyle';
import { AmountModeSwitch } from '~/components';
import { transactionsActions } from '~/redux/slices';
import { selectIsApplyingAction } from '~/redux/selectors';
import { useActions } from '~/hooks';
import { TransactionMode } from '~/models';
import { REQUIRED_RULE } from '~/const';

import { StyledModal, StyledModalFooter } from './AddTransactionFeeModal.styled';

type FormType = {
    label: string;
    amount: number;
};

interface EditTransactionFeeModalProps {
    close: () => void;
    selectedAction: CustomActionConfigurationShort;
    data: CustomActionData;
}

export const AddTransactionFeeModal: FC<EditTransactionFeeModalProps> = ({ close, selectedAction, data }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm<FormType>();
    const { getFieldsError } = form;
    const [mode, setMode] = useState<TransactionMode>(TransactionMode.add);

    const isApplyingAction = useSelector(selectIsApplyingAction);
    const { addTransactionFee } = useActions(transactionsActions);

    const currency = data?.transaction?.currency || DEFAULT_CURRENCY;

    const onFinish = useCallback(
        (values: FormType) => {
            if (!data.transaction) return;

            let amount = calculateValueAndPrecision(values.amount.toString());

            if (mode === TransactionMode.add) {
                amount.value = amount.value * -1;
            }

            addTransactionFee({
                onSuccess: close,
                transactionId: data.transaction.id,
                values: {
                    label: values.label,
                    amount,
                },
            });
        },
        [addTransactionFee, close, data.transaction, mode],
    );

    const shouldDisableSubmit = useCallback(() => {
        return !!getFieldsError().filter(({ errors }) => errors.length).length;
    }, [getFieldsError]);

    return (
        <StyledModal visible title={selectedAction.label} footer={null} onCancel={close}>
            <Text>{t('modals.add_fee.specify_fee')}</Text>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <StyledFormItem label={t('common.label')} name="label" required rules={REQUIRED_RULE}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem label={t('common.mode')} name="mode" required>
                    <AmountModeSwitch mode={mode} changeMode={setMode} />
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
