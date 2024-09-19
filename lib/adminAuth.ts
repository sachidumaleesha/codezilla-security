import { getUserRole } from './getUserRole';
import { redirect } from 'next/navigation';

export async function adminAuth() {
  const role = await getUserRole();

  if (role !== 'ADMIN') {
    redirect('/');
  }
}
