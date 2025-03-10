import { LineConfigBase } from '@bo/utils';

export const enum CustomerPanelDefaultLines {
    NAME = 'NAME',
    PHONE = 'PHONE',
    EMAIL = 'EMAIL',
}

export type CustomerPanelLines = LineConfigBase<keyof typeof CustomerPanelDefaultLines>;
