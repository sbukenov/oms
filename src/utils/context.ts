import { Context, createContext } from 'react';
import type { DiscriminatedModuleData } from '@bo/module-generic';

import type { ModuleConfig } from '~/models';
import { packageName } from '~/const';

type ModuleDataWithConfig = DiscriminatedModuleData<ModuleConfig>;

let moduleContext: Context<ModuleDataWithConfig>;

export const initModuleContext = (data: ModuleDataWithConfig) => {
    if (moduleContext) return moduleContext;

    moduleContext = createContext(data);
    return moduleContext;
};

export const getModuleContext = () => {
    if (!moduleContext) {
        throw new Error(`${packageName}: No context found`);
    }
    return moduleContext;
};
