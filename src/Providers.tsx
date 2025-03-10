import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { getModuleContext } from '~/utils';
import i18n from '~/utils/i18n';
import { store } from '~/redux/store';

import { OMSGlobalStyles } from './style/commonStyle';
import { Routing } from './Routing';

interface ProvidersProps {
    discriminatedModulesData: any;
}

const Providers: React.FC<ProvidersProps> = ({ discriminatedModulesData }) => {
    const { pathname } = useLocation();
    const moduleContext = getModuleContext();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <moduleContext.Provider value={discriminatedModulesData}>
            <OMSGlobalStyles />
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <Routing />
                </I18nextProvider>
            </Provider>
        </moduleContext.Provider>
    );
};

export default Providers;
