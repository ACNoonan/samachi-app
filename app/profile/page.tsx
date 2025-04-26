import { PageLayout } from '@/app/components/layout/PageLayout';
import { ProfileSettings } from '@/app/(authenticated)/profile/ProfileSettings';

export default function ProfilePage() {
  return (
    <PageLayout>
      <ProfileSettings />
    </PageLayout>
  );
} 