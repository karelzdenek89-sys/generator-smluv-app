import { redirect } from 'next/navigation';

export default function PasswordRecoveryAlias() {
  redirect('/moje?mode=forgot');
}
