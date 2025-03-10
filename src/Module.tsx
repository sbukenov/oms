import React, { useEffect, lazy, Suspense } from 'react';
import { BaseModuleConfig } from '@types/bo-module-aggregator';
import { BaseModuleProps, ModuleGeneric } from '@bo/module-generic';
import { addBundleIntoInstance, translateNavigation } from '@bo/utils';

import { initMonolithAccessors } from '~/utils/accessors';
import { initModuleContext } from '~/utils/context';
import i18n from '~/utils/i18n';
import { initAccessors } from '~/utils/accessors';
import '~/utils/libraryInitializating';
import { packageName, NAVIGATION, DEFAULT_API, DEFAULT_BASE_ROUTE, DEFAULT_MONOLITH_API } from '~/const';

import defaultConfig from './default-config.json';

const Providers = lazy(() => import(/* webpackChunkName: "moduleOmsV2" */ './Providers'));

export type OMSBaseProps = BaseModuleProps;

const ModuleOmsV2: React.FC<OMSBaseProps> = ({
    moduleName,
    locales,
    navigation = NAVIGATION,
    baseRoute = DEFAULT_BASE_ROUTE,
    url = DEFAULT_API,
    monolithUrl = DEFAULT_MONOLITH_API,
    ...props
}) => {
    useEffect(() => {
        addBundleIntoInstance(i18n, locales);
    }, [locales]);

    return (
        <ModuleGeneric
            moduleName={moduleName ?? packageName}
            defaultConfig={defaultConfig as BaseModuleConfig}
            navigation={translateNavigation(navigation, i18n.t)}
            url={url}
            initAccessors={initAccessors}
            monolithUrl={monolithUrl}
            initMonolithAccessors={initMonolithAccessors}
            baseRoute={baseRoute}
            {...props}
        >
            {(discriminatedModulesData) => {
                initModuleContext(discriminatedModulesData);
                return (
                    <Suspense fallback={<>{i18n.t('common.loading')}</>}>
                        <Providers discriminatedModulesData={discriminatedModulesData} />
                    </Suspense>
                );
            }}
        </ModuleGeneric>
    );
};

Object.defineProperty(ModuleOmsV2, 'name', {
    writable: false,
    value: 'ModuleOmsV2',
});

export { ModuleOmsV2 };
