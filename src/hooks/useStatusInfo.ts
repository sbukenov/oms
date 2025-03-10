import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableLanguages } from '@types/bo-module-aggregator';
import { Color } from '@bo/component-library';

import { getModuleContext } from '~/utils/context';
import { StatusGroups, StatusCodes } from '~/models';
import { STATUSES } from '~/const';

export const useStatusInfo = (statusGroup: StatusGroups, statusCode?: StatusCodes) => {
    const { config } = useContext(getModuleContext());
    const { t, i18n } = useTranslation();
    /**
     * Default color and label if the function is called with an incorrect status code that does not exist in the corresponding group
     */
    let statusColor = Color.neutral(7);
    let statusLabel = statusCode || t('errors.incorrect_status_code');

    // @ts-ignore
    const customStatusGroup: any = config?.specific?.statuses?.[statusGroup] || STATUSES[statusGroup];

    if (statusCode && customStatusGroup && statusCode in customStatusGroup) {
        const currentLang = i18n.resolvedLanguage as AvailableLanguages;
        const customStatusInfo = customStatusGroup[statusCode];

        statusColor = customStatusInfo?.color;

        statusLabel = customStatusInfo?.title[currentLang];
    }

    return { statusLabel, statusColor };
};
