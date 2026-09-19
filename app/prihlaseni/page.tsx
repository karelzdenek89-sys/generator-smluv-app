import { redirect } from 'next/navigation';

export default function LoginAlias() {
  redirect('/moje?mode=login');
}
