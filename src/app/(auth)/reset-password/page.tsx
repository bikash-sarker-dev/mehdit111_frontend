import ResetPasswordForm from "@/components/authencation/ResetPasswordForm";

// Example: app/(auth)/reset-password/page.tsx
export default function ResetPasswordPage() {
  return (
    <ResetPasswordForm
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
}
