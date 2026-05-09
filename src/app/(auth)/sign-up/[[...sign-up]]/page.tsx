import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #D9E8FF 0%, #FFFFFF 100%)',
      }}
    >
      <SignUp />
    </div>
  );
}
