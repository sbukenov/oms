import { Icon } from '@bo/component-library';
import type { CustomActionConfigurationShort } from '@bo/utils';
import { ColumnProps, TableProps } from 'antd/lib/table';
import Button from 'antd/lib/button';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { ROUTE_RECEPTION } from '~/const';
import { Status } from '~/components/Status';
import { useActions } from '~/hooks';
import type { ReplenishmentOperation, StatusCodes } from '~/models';
import { selectOrderDetailsId, selectOrderExpeditions } from '~/redux/selectors';
import { ButtonBoldStyled } from '~/style/commonStyle';
import { expeditionsActions } from '~/redux/slices';
import { getModuleContext } from '~/utils';

import { ModalBody, ModalFooter, ModalStyled, TableStyled } from './OrderReceptionModal.styled';
import { DeliveryAdditionModal } from '../DeliveryAdditionModal';

interface OrderReceptionModalProps {
    close: () => void;
    config: CustomActionConfigurationShort;
}

export const OrderReceptionModal: FC<OrderReceptionModalProps> = ({ close, config }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const { baseRoute } = useContext(getModuleContext());
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const orderId = useSelector(selectOrderDetailsId);
    const { expeditions, loading } = useSelector(selectOrderExpeditions);
    const { getOrderExpeditionsRequest } = useActions(expeditionsActions);

    const columns = useMemo<ColumnProps<ReplenishmentOperation>[]>(
        () => [
            { title: t('common.reference'), dataIndex: 'reference' },
            {
                title: t('common.status'),
                dataIndex: 'status',
                render: (status: StatusCodes) => {
                    return <Status group="orderReception" code={status} />;
                },
            },
        ],
        [t],
    );

    const rowSelection = useMemo<TableProps<ReplenishmentOperation>['rowSelection']>(
        () => ({
            type: 'radio',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
        }),
        [selectedRowKeys],
    );

    useEffect(() => {
        !!orderId && getOrderExpeditionsRequest(orderId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClick = useCallback(() => {
        if (!orderId) throw new Error('No order id');

        const [id] = selectedRowKeys;
        const params = new URLSearchParams({
            order: orderId,
        }).toString();

        navigate(`/${baseRoute}/${ROUTE_RECEPTION}/${id}?${params}`);
    }, [baseRoute, navigate, orderId, selectedRowKeys]);

    const closeModal = useCallback(() => setModalOpen(false), []);

    const openModal = useCallback(() => setModalOpen(true), []);

    return (
        <ModalStyled title={t('modals.order_reception.select_delivery')} onCancel={close} visible footer={null}>
            {isModalOpen && (
                <DeliveryAdditionModal close={closeModal} closeParentModal={close} tableConfig={config.table} />
            )}
            <ModalBody>
                <TableStyled
                    rowKey="id"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={expeditions}
                    loading={loading}
                    pagination={false}
                    scroll={{ y: 56 * 4 }}
                />
                <ButtonBoldStyled type="link" icon={<Icon name="add" size="sm" />} onClick={openModal}>
                    {t('modals.order_reception.add_new_delivery')}
                </ButtonBoldStyled>
            </ModalBody>
            <ModalFooter>
                <Button type="link" onClick={close}>
                    {t('common.cancel')}
                </Button>
                <Button type="primary" htmlType="submit" disabled={!selectedRowKeys.length} onClick={onClick}>
                    {t('modals.order_reception.receive')}
                </Button>
            </ModalFooter>
        </ModalStyled>
    );
};
