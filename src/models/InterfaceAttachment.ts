import type { AttachmentProps } from '@bo/keystone-components';

export type Attachment = Required<Omit<AttachmentProps, 'id'>>;
