export const enum Transition {
    create = 'create', // from: TO_PROCESS to: TO_PROCESS
    complete = 'complete', // from: [ TO_PROCESS, PROCESSING ] to: PROCESSED
    process = 'process', // from: [ TO_PROCESS, PROCESSING ] to: PROCESSING
    cannot_process = 'cannot_process', // from: [ TO_PROCESS, PROCESSING ] to: UNABLE_TO_PROCESS
}

export interface TransitionPayload {
    transition: Transition;
    pickup_code?: string;
}
