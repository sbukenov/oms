import React, { FC, useEffect, useMemo, useCallback } from 'react';
import Button from 'antd/lib/button';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import type { ColumnProps } from 'antd/lib/table';
import { useLocation } from 'react-router-dom';
import { Alert } from '@bo/component-library';
import { IdParam } from '@-bo/utils';

import { CommonLayout, LabelBoxStyled, SpaceStyled } from '~/style/commonStyle';
import { useActions } from '~/hooks';
import { fulfillmentsActions } from '~/redux/slices';
import { selectFulfillmentPreparation } from '~/redux/selectors';
import { calculatePicked, isFulfillmentReadyForPreparation, showReference } from '~/utils/helpers';
import { PrepareLineDropdown, Status } from '~/components';
import type { FulfillmentItem } from '~/models';
import { FulfillmentItemStatusCodes } from '~/models';
import { PageHeaderStyled, PickedValue, StyledTable, InformationLine } from './FulfillmentPreparation.styled';

export const FulfillmentPreparation: FC = () => {
    const { id } = useParams<IdParam>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { getFulfillmentDetails, confirmPreparation } = useActions(fulfillmentsActions);
    const { loading, data: fulfillment } = useSelector(selectFulfillmentPreparation);

    useEffect(() => {
        id && getFulfillmentDetails(id);
    }, [getFulfillmentDetails, id]);

    const onConfirm = useCallback(() => {
        id && confirmPreparation({ fulfillmentId: id, navigate, state });
    }, [confirmPreparation, id, navigate, state]);

    const showConfirmPreparationModal = useCallback(() => {
        Alert.confirm({
            title: t('modals.confirm_preparation.title'),
            content: t('modals.confirm_preparation.content'),
            okText: t('common.yes_confirm'),
            cancelText: t('common.go_back'),
            onOk: onConfirm,
        });
    }, [t, onConfirm]);

    const columns: ColumnProps<FulfillmentItem>[] = useMemo(
        () => [
            {
                title: t('fulfillment_preparation.table.items'),
                dataIndex: 'label',
                key: 'label',
            },
            {
                title: t('common.status'),
                key: 'completion',
                render: (_, fulfillmentItem) => <Status group="fulfillmentItem" code={fulfillmentItem.completion} />,
            },
            {
                title: t('fulfillment_preparation.table.ordered'),
                dataIndex: ['quantity', 'quantity'],
                key: 'quantity',
                align: 'center',
            },
            {
                title: t('fulfillment_preparation.table.picked'),
                dataIndex: ['fulfilled_items_quantities', 'PICKED'],
                align: 'center',
                key: 'picked',
                render: (_, fulfillmentItem) => <PickedValue>{calculatePicked(fulfillmentItem)}</PickedValue>,
            },
            {
                title: t('fulfillment_preparation.table.out_of_stock'),
                dataIndex: ['fulfilled_items_quantities', 'OUT_OF_STOCK'],
                align: 'center',
                key: 'outOfStock',
                render: (value) => value || 0,
            },
            {
                dataIndex: '',
                title: '',
                align: 'center',
                width: 50,
                render: (_, fulfillmentItem) => {
                    if (
                        fulfillmentItem.completion === FulfillmentItemStatusCodes.UNABLE_TO_PROCESS ||
                        fulfillmentItem.completion === FulfillmentItemStatusCodes.PROCESSED
                    ) {
                        return '';
                    }
                    return <PrepareLineDropdown item={fulfillmentItem} />;
                },
            },
        ],
        [t],
    );

    if (!isFulfillmentReadyForPreparation(fulfillment)) {
        return null;
    }

    const subTitle = (
        <SpaceStyled size="middle">
            <LabelBoxStyled strong>{showReference(fulfillment?.reference)}</LabelBoxStyled>
            <Status group="fulfillment" code={fulfillment?.status} />
        </SpaceStyled>
    );

    return (
        <>
            <PageHeaderStyled
                subTitle={subTitle}
                extra={[
                    <Button key="extra-1" type="primary" onClick={showConfirmPreparationModal}>
                        {t('common.confirm')}
                    </Button>,
                ]}
            />
            <CommonLayout>
                <InformationLine type="secondary">{t('fulfillment_preparation.information_line')}</InformationLine>
                <StyledTable
                    rowKey="id"
                    columns={columns}
                    dataSource={fulfillment?.fulfillment_items}
                    loading={loading}
                    pagination={false}
                />
            </CommonLayout>
        </>
    );
};
