import type { NotificationGroupAdminSignUp } from 'mastodon/models/notification_group';
import PersonAddIcon from '@/material-icons/400-24px/person_add-fill.svg?react';
import { FormattedMessage } from 'react-intl';
import { NotificationGroupWithStatus } from './notification_group_with_status';

const labelRenderer = values =>
  <FormattedMessage id='notification.admin.sign_up' defaultMessage='{name} signed up' values={values} />;

export const NotificationAdminSignUp: React.FC<{
  notification: NotificationGroupAdminSignUp;
}> = ({ notification }) => (
  <NotificationGroupWithStatus
    type='admin-sign-up'
    icon={PersonAddIcon}
    accountIds={notification.sampleAccountsIds}
    timestamp={notification.latest_page_notification_at}
    count={notification.notifications_count}
    labelRenderer={labelRenderer}
  />
);
