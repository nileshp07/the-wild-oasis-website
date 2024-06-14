import {getBookedDatesByCabinId, getCabin} from '@/app/_lib/data-service';

export async function GET(request, {params}) {
	console.log(params);
	const [cabins, bookedDates] = await Promise.all([getCabin(params.cabinId), getBookedDatesByCabinId(params.cabinId)]);

	try {
		return Response.json({cabins, bookedDates});
	} catch (error) {
		return Response.json({message: 'Cabin could not be found'});
	}
}
