import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator, bindActionCreators } from 'redux';

/**
 * Util hook. Allows to supply actions map and receive wrapped action dispatchers
 * @param {object} actions - actions map
 * @param {any[]} deps - array of dependencies
 * @returns object with actions wrapped with dispatch
 */
export const useActions = <T extends Record<string, ActionCreator<any>>>(actions: T, deps: any[] = []): T => {
    const dispatch = useDispatch();

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch);
        // eslint can't analyze dynamic dependency list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, dispatch, ...deps]);

    return boundActions;
};
