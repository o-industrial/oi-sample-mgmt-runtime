import { z } from 'zod';

/**
 * User notification — approval requests, status changes, deadline warnings, escalations.
 */
export const NotificationRecordSchema = z.object({
  NotificationId: z.string().describe('Unique notification identifier'),
  UserId: z.string().describe('Target user'),
  Type: z.enum([
    'approval-request',
    'status-change',
    'deadline-approaching',
    'escalation',
  ]).describe('Notification type'),
  EntityType: z.string().describe(
    'Type of entity this notification relates to',
  ),
  EntityId: z.string().describe('ID of the related entity'),
  Message: z.string().describe('Notification message'),
  Read: z.boolean().describe('Whether notification has been read'),
  CreatedAt: z.string().describe('Timestamp of creation'),
  ActionUrl: z.string().optional().describe('URL for user action'),
});

export type NotificationRecord = z.infer<typeof NotificationRecordSchema>;
