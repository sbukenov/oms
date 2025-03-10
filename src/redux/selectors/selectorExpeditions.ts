import type { RootState } from '~/models';

export const selectOrderExpeditions = (state: RootState) => state.expeditions.orderExpeditions;
export const selectAttachmentDeleting = (state: RootState) => state.expeditions.isDeletingAttachment;
