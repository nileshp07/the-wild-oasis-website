import {Suspense} from 'react';
import CabinList from '@/app/_components/CabinList';
import Spinner from '@/app/_components/Spinner';
import Filter from '@/app/_components/Filter';
import ReservationReminder from '@/app/_components/ReservationReminder';

// revalidating the cache (always fetch the fresh data from server) each time a new request is done , makes this page/route dynamic instead of static
// export const revalidate = 0;

//revalidate automatically after 1hr and generate static html again (ISR)
//this will not work as we are using searchParams which will make this component/page/route render dynamically again.
export const revalidate = 3600; //1hr in sec

export const metadata = {
	title: 'Cabins',
};

export default function Page({searchParams}) {
	const filter = searchParams?.capacity ?? 'all';

	return (
		<div>
			<h1 className='text-4xl mb-5 text-accent-400 font-medium'>Our Luxury Cabins</h1>
			<p className='text-primary-200 text-lg mb-10'>
				Cozy yet luxurious cabins, located right in the heart of the Italian Dolomites. Imagine waking up to beautiful mountain views, spending your days
				exploring the dark forests around, or just relaxing in your private hot tub under the stars. Enjoy nature&apos;s beauty in your own little home away
				from home. The perfect spot for a peaceful, calm vacation. Welcome to paradise.
			</p>

			<div className='flex justify-end mb-8'>
				<Filter />
			</div>

			{/* Wrap the component which need data fetching (async task) inside suspense with a fallback Spinner component until the async task is done  */}
			<Suspense fallback={<Spinner />} key={filter}>
				<CabinList filter={filter} />
				<ReservationReminder />
			</Suspense>
		</div>
	);
}
