export type Uuids = string[];

export interface Items<T> {
    [uuid: string]: T;
}

export interface Normalize<T> {
    byUuid: Items<T>;
    uuids: Uuids;
}
