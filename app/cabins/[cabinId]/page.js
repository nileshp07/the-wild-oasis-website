import Cabin from '@/app/_components/Cabin';
import DateSelector from '@/app/_components/DateSelector';
import Reservation from '@/app/_components/Reservation';
import ReservationForm from '@/app/_components/ReservationForm';
import Spinner from '@/app/_components/Spinner';
import {getCabin, getCabins} from '@/app/_lib/data-service';

import {Suspense} from 'react';

// Generating dynamic metadata for dynamic routes segments
export async function generateMetadata({params}) {
	const {name} = await getCabin(params.cabinId);
	return {
		title: `Cabin ${name}`,
	};
}

// for staticly generating the HTML for the dynamic route segments that we know will be in the finite set of values
export async function generateStaticParams() {
	const cabins = await getCabins();

	const cabinIds = cabins.map((cabin) => ({cabinId: String(cabin.id)}));

	return cabinIds;
}

//Dynamic segment route pages gets access to "params" object
export default async function Page({params}) {
	const cabin = await getCabin(params.cabinId);
	// cabinId is the name of the url parameter and has to be same as the [foldername] inside which this page is

	return (
		<div className='max-w-6xl mx-auto mt-8'>
			<Cabin cabin={cabin} />
			<div>
				<h2 className='text-5xl font-semibold text-center text-accent-400'>Reserve {cabin.name} today. Pay on arrival.</h2>

				<Suspense fallback={<Spinner />}>
					<Reservation cabin={cabin} />
				</Suspense>
			</div>
		</div>
	);
}
