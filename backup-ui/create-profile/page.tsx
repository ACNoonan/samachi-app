import { CreateProfileForm } from '@/app/components/auth/CreateProfileForm';
import { Suspense } from 'react';

// Use Suspense because CreateProfileForm uses useSearchParams
function CreateProfileContent() {
  return <CreateProfileForm />;
}

export default function CreateProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile form...</div>}> {
      /* Wrap CreateProfileContent with Suspense */}
      <CreateProfileContent />
    </Suspense>
  );
} 