import { SignIn } from "@/app/components/auth/SignIn";

export default function RegisterPage() {
  // TODO: Potentially add onboarding video step here before showing the form,
  // based on original UX requirements.
  
  // Render the SignIn component. It will detect the '/register' pathname
  // and automatically display the Sign Up form.
  return <SignIn />;
} 