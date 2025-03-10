import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';

import { REQUIRED_MAX_RULE } from '~/const';
import { useActions } from '~/hooks';
import { selectOrderDetails } from '~/redux/selectors';
import { orderDetailsActions } from '~/redux/slices';
import type { EditedComment } from '~/models';
import { FormStyled } from '~/style/commonStyle';

import { ModalRoot } from './EditCommentModal.styled';

interface EditCommentModalProps {
    editedComment: EditedComment;
    close: () => void;
}

export const EditCommentModal: FC<EditCommentModalProps> = ({ editedComment, close }) => {
    const { loading } = useSelector(selectOrderDetails);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { getFieldsError, isFieldsTouched, getFieldValue } = form;
    const { editComment } = useActions(orderDetailsActions);

    const onFinish = useCallback(
        (values) => {
            editComment({
                commentId: editedComment.id,
                title: values.title,
                content: values.content?.trim() || undefined,
                onSuccess: () => close(),
            });
        },
        [close, editComment, editedComment],
    );

    const initialValues = useMemo(
        () => ({
            title: editedComment.title,
            content: editedComment.content,
        }),
        [editedComment],
    );

    const shouldDisableSumit = useCallback(() => {
        const fieldsNotTouched = !isFieldsTouched();
        const hasErrors = !!getFieldsError().filter(({ errors }) => errors.length).length;
        const titleValueEmpty = !getFieldValue('title')?.trim();

        return fieldsNotTouched || hasErrors || titleValueEmpty;
    }, [getFieldValue, getFieldsError, isFieldsTouched]);

    return (
        <ModalRoot
            visible
            okText={t('order.comments.form.edit')}
            title={t('order.comments.form.edit_comment')}
            onCancel={close}
            footer={null}
            cancelButtonProps={{ type: 'link' }}
        >
            <FormStyled layout="vertical" form={form} onFinish={onFinish} initialValues={initialValues}>
                <Typography>{t('order.comments.form.make_changes')}</Typography>
                <Form.Item name="title" label={t('order.comments.form.title.label')} rules={REQUIRED_MAX_RULE}>
                    <Input placeholder={t('order.comments.form.title.placeholder')} />
                </Form.Item>
                <Form.Item name="content" label={t('order.comments.form.comment.label')}>
                    <Input.TextArea placeholder={t('order.comments.form.comment.placeholder')} rows={4} />
                </Form.Item>
                <Form.Item shouldUpdate className="form-footer">
                    {() => (
                        <>
                            <Button onClick={() => close()}>{t('common.cancel')}</Button>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={shouldDisableSumit()}>
                                {t('common.edit')}
                            </Button>
                        </>
                    )}
                </Form.Item>
            </FormStyled>
        </ModalRoot>
    );
};
