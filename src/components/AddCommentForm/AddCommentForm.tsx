import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import { mapIdToValueOption, getSelectedEntity } from '@bo/utils';
import { SelectFilter, StyledFormItem } from '@bo/keystone-components';

import { useActions } from '~/hooks';
import { orderDetailsActions } from '~/redux/slices';
import { selectOrderDetails, selectOrderBusinessUnits } from '~/redux/selectors';
import {
    REQUIRED_MAX_RULE,
    REQUIRED_RULE,
    QA_COMMENTS_SENDER,
    QA_COMMENTS_RECIPIENT,
    QA_COMMENTS_TITLE,
    QA_COMMENTS_COMMENT,
    QA_COMMENTS_ADD_BUTTON,
} from '~/const';
import { FormStyled } from '~/style/commonStyle';
import { CommentForm } from '~/models';

import { SubmitButton, SpaceStyled } from './AddCommentForm.styled';

export const AddCommentForm: FC = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm<CommentForm>();
    const { addComment } = useActions(orderDetailsActions);
    const { loading } = useSelector(selectOrderDetails);
    const businessUnits = useSelector(selectOrderBusinessUnits);

    const sender: string = getSelectedEntity()?.uuid;

    const initialValues = { sender };

    const { resetFields, getFieldsError, isFieldTouched, getFieldValue } = form;

    const onFinish = useCallback(
        ({ title, sender, content, recipient }: CommentForm) => {
            addComment({
                title,
                sender,
                recipient,
                content: content?.trim(),
                onSuccess: resetFields,
            });
        },
        [addComment, resetFields],
    );

    const shouldDisableSubmit = useCallback(() => {
        const titleNotTouched = !isFieldTouched('title');
        const hasErrors = !!getFieldsError().filter(({ errors }) => errors.length).length;
        const titleValueEmpty = !getFieldValue('title')?.trim();
        return titleNotTouched || hasErrors || titleValueEmpty;
    }, [getFieldValue, getFieldsError, isFieldTouched]);

    return (
        <FormStyled layout="vertical" form={form} onFinish={onFinish} initialValues={initialValues}>
            <SpaceStyled>
                <SelectFilter
                    className={QA_COMMENTS_SENDER}
                    label={t('order.comments.form.sender.label')}
                    name="sender"
                    placeholder={t('order.comments.form.sender.placeholder')}
                    options={businessUnits?.map(mapIdToValueOption)}
                    tooltip={t('order.comments.form.sender.tooltip')}
                    rules={REQUIRED_RULE}
                    optionFilterProp="label"
                    disabled={!!sender}
                    required
                    allowClear
                    showSearch
                />
                <SelectFilter
                    className={QA_COMMENTS_RECIPIENT}
                    label={t('order.comments.form.entity.label')}
                    name="recipient"
                    placeholder={t('order.comments.form.entity.placeholder')}
                    options={businessUnits?.map(mapIdToValueOption)}
                    tooltip={t('order.comments.form.entity.tooltip')}
                    optionFilterProp="label"
                    allowClear
                    showSearch
                />
            </SpaceStyled>
            <SpaceStyled>
                <StyledFormItem
                    name="title"
                    label={t('order.comments.form.title.label')}
                    rules={REQUIRED_MAX_RULE}
                    required
                >
                    <Input className={QA_COMMENTS_TITLE} placeholder={t('order.comments.form.title.placeholder')} />
                </StyledFormItem>
            </SpaceStyled>
            <StyledFormItem name="content" label={t('order.comments.form.comment.label')}>
                <Input.TextArea
                    className={QA_COMMENTS_COMMENT}
                    placeholder={t('order.comments.form.comment.placeholder')}
                    rows={4}
                />
            </StyledFormItem>
            <StyledFormItem shouldUpdate>
                {() => (
                    <SubmitButton
                        className={QA_COMMENTS_ADD_BUTTON}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={shouldDisableSubmit()}
                    >
                        {t('order.comments.form.submit')}
                    </SubmitButton>
                )}
            </StyledFormItem>
        </FormStyled>
    );
};
