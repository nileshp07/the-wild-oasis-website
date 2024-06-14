'use server';

import {auth, signIn, signOut} from '@/app/_lib/auth';
import {supabase} from './supabase';
import {revalidatePath} from 'next/cache';
import {getBookings} from './data-service';
import {redirect} from 'next/navigation';

export async function updateGuest(formData) {
	const session = await auth();
	if (!session) throw new Error('You must be logged in.');

	const nationalID = formData.get('nationalID');
	const [nationality, countryFlag] = formData.get('nationality').split('%');

	if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error('Please provide a valid nationalID');

	const updateData = {nationality, countryFlag, nationalID};

	const {data, error} = await supabase.from('guests').update(updateData).eq('id', session.user.guestId);

	if (error) {
		throw new Error('Guest could not be updated');
	}

	//revalidate the router cache each time this server action is performed for this route to get the fresh data and not stale data that stays for 30secs in the browsers cache for dynamic routes
	revalidatePath('/account/profile');
}

export async function createBooking(bookingData, formData) {
	const session = await auth();
	if (!session) throw new Error('You must be logged in.');

	const newBooking = {
		...bookingData,
		guestId: session.user.guestId,
		numGuests: Number(formData.get('numGuests')),
		observations: formData.get('observations'),
		extrasPrice: 0,
		isPaid: false,
		status: 'unconfirmed',
		totalPrice: bookingData.cabinPrice,
		hasBreakfast: false,
	};

	console.log(newBooking);

	const {error} = await supabase.from('bookings').insert([newBooking]);

	if (error) throw new Error('Booking could not be created');

	revalidatePath(`/cabins/${bookingData.cabinId}`);

	redirect('/cabins/thankyou');
}

export async function deleteBooking(bookingId) {
	await new Promise((res) => setTimeout(res, 2000));

	const session = await auth();
	if (!session) throw new Error('You must be logged in.');

	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingIds = guestBookings.map((booking) => booking.id);

	if (!guestBookingIds.includes(bookingId)) throw new Error('You are not allowed to delete this booking.');

	const {error} = await supabase.from('bookings').delete().eq('id', bookingId);

	if (error) throw new Error('Booking could not be deleted');

	// revalidation the cache for this route to get the fresh data
	revalidatePath('/account/reservations');
}

export async function updateReservation(formData) {
	const bookingId = Number(formData.get('bookingId'));

	const session = await auth();
	if (!session) throw new Error('You must be logged in.');

	const guestBookings = await getBookings(session.user.guestId);
	const guestBookingIds = guestBookings.map((booking) => booking.id);

	if (!guestBookingIds.includes(bookingId)) throw new Error('You are not allowed to update this booking.');

	const numGuests = Number(formData.get('numGuests'));
	const observations = formData.get('observations').slice(0, 1000);

	const updateData = {numGuests, observations};

	const {error} = await supabase.from('bookings').update(updateData).eq('id', bookingId).select().single();

	if (error) throw new Error('Booking could not be updated');

	revalidatePath(`/account/reservations/edit/${bookingId}`);

	redirect('/account/reservations');
}

export async function signInAction() {
	await signIn('google', {redirectTo: '/account'});
}

export async function signOutAction() {
	await signOut({redirectTo: '/'});
}
