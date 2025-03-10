import { Icon } from '@-bo/component-library';
import { IdParam, showSuccessNotification } from '@-bo/utils';
import Button from 'antd/lib/button';
import useModal from 'antd/lib/modal/useModal';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { AddingProductsModal } from '~/components/modals';

import { QA_RECEPTION_DETAILS_GO_BACK, QA_RECEPTION_DETAILS_TITLE, ROUTE_ORDER, ROUTE_RECEPTION } from '~/const';
import { useActions } from '~/hooks';
import type { ReceptionQuantitiesById } from '~/models';
import { selectOrderDetailsData, selectReceptionDataSource, selectReceptionDetails } from '~/redux/selectors';
import { orderDetailsActions, receptionCreationActions } from '~/redux/slices';
import { getModuleContext } from '~/utils';

import { PageHeaderStyled } from './ReceptionCreation.styled';
import { ReceptionCreationTable } from './ReceptionCreationTable';

export const ReceptionCreation: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<IdParam>();
    const [searchParams] = useSearchParams();
    const { baseRoute } = useContext(getModuleContext());
    const [modal, contextHolder] = useModal();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [quantitiesById, setQuantitiesById] = useState<ReceptionQuantitiesById>({});
    const [isProductModalOpened, setIsProductModalOpened] = useState(false);
    const order = useSelector(selectOrderDetailsData);
    const reception = useSelector(selectReceptionDetails);
    const dataSource = useSelector(selectReceptionDataSource);

    const { getOrderDetailsRequest, resetOrderDetails } = useActions(orderDetailsActions);
    const { getReception, createReception, resetReceptionCreation, addReceptionProductKeys, deleteReceptionProduct } =
        useActions(receptionCreationActions);

    const onBack = useCallback(() => {
        modal.confirm({
            title: t('modals.cancel_receive_reception.title'),
            content: t('modals.cancel_receive_reception.content'),
            okText: t('common.yes_cancel'),
            cancelText: t('common.go_back'),
            cancelButtonProps: {
                className: 'tertiary',
            },
            onOk: () => navigate(-1),
        });
    }, [modal, navigate, t]);

    useEffect(() => {
        const orderId = searchParams.get('order');
        orderId && getOrderDetailsRequest(orderId);
        id && orderId && getReception({ expeditionId: id, orderId });

        return () => {
            resetOrderDetails();
            resetReceptionCreation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = useCallback(() => {
        modal.confirm({
            title: t('modals.confirm_reception.title'),
            content: t('modals.confirm_reception.content'),
            okText: t('common.confirm'),
            cancelText: t('common.cancel'),
            cancelButtonProps: {
                className: 'tertiary',
            },
            onOk: () => {
                createReception({
                    quantitiesById,
                    onSuccess() {
                        navigate(`/${baseRoute}/${ROUTE_ORDER}/${order?.id}/${ROUTE_RECEPTION}`, { replace: true });
                        showSuccessNotification({
                            message: t('common.success'),
                            description: t('notifications.reception_created'),
                        });
                    },
                });
            },
        });
    }, [baseRoute, createReception, modal, navigate, order?.id, quantitiesById, t]);

    const shouldDisableSubmit =
        dataSource?.length !== selectedRowKeys.length ||
        Object.values(quantitiesById).some(
            ({ damaged, missing, received }) => damaged === 0 && missing === 0 && received === 0,
        );

    const showModal = useCallback(() => {
        setIsProductModalOpened(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsProductModalOpened(false);
    }, []);

    if (!order || !reception) {
        return (
            <>
                {contextHolder}
                <PageHeaderStyled
                    title={<span className={QA_RECEPTION_DETAILS_TITLE}>-</span>}
                    backIcon={<Icon className={QA_RECEPTION_DETAILS_GO_BACK} name="arrow-left" />}
                    onBack={onBack}
                />
            </>
        );
    }

    return (
        <div>
            {contextHolder}
            {isProductModalOpened && (
                <AddingProductsModal
                    close={hideModal}
                    supplier={reception.shipper.id}
                    addProductKeys={addReceptionProductKeys}
                />
            )}
            <PageHeaderStyled
                title={
                    <span className={QA_RECEPTION_DETAILS_TITLE}>
                        {`${t('common.order')} ${order?.reference} / ${t('common.reception')} ${reception?.reference}`}
                    </span>
                }
                backIcon={<Icon className={QA_RECEPTION_DETAILS_GO_BACK} name="arrow-left" />}
                onBack={onBack}
                extra={
                    <Button type="primary" onClick={onSubmit} disabled={shouldDisableSubmit}>
                        {t('common.receive')}
                    </Button>
                }
            />
            <ReceptionCreationTable
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                dataSource={dataSource}
                quantitiesById={quantitiesById}
                setQuantitiesById={setQuantitiesById}
                showModal={showModal}
                reception={reception}
                deleteReceptionProduct={deleteReceptionProduct}
            />
        </div>
    );
};
