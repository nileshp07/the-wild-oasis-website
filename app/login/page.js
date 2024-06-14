import SignInButton from '@/app/components/SignInButton';
import {auth} from '@/app/_lib/auth';
import {redirect} from 'next/navigation';

export const metadata = {
	title: 'Login',
};

export default async function Page() {
	const session = await auth();

	// If user already exits in the session , redirect to home page
	if (session?.user) {
		redirect('/');
	}

	return (
		<div className='flex flex-col gap-10 mt-10 items-center'>
			<h2 className='text-3xl font-semibold'>Sign in to access your guest area</h2>
			<SignInButton />
		</div>
	);
}
