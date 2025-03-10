import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { usePrivileges } from '@bo/utils';

import { getModuleContext } from '~/utils';
import { selectOrdersBusinessUnits } from '~/redux/selectors';

interface UseActionListDataProps {
    list: any[];
    filters: Record<string, any>;
    search: string;
}

export const useActionListData = ({ list, filters, search }: UseActionListDataProps) => {
    const { baseRoute, url } = useContext(getModuleContext());
    const businessUnits = useSelector(selectOrdersBusinessUnits);
    const privileges = usePrivileges(getModuleContext());

    return { list, filters, search, url, baseRoute, privileges, businessUnits };
};
