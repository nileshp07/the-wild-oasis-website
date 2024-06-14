import '@/app/_styles/globals.css';
import {Josefin_Sans} from 'next/font/google';
import Header from '@/app/_components/Header';
import {ReservationProvider} from '@/app/_components/ReservationContext';

// font configurations on Josefin_Sans google font
const josefin = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
});

export const metadata = {
	title: {
		//%s will replace to the title from each page that is exported from the metadata of that page.
		template: '%s | The Wild Oasis',
		default: 'Welcome | The Wild Oasis',
	},
	description: 'Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests.',
};

export default function RootLayout({children}) {
	return (
		<html>
			<body className={` ${josefin.className} bg-primary-950 text-primary-100 antialiased min-h-screen flex flex-col relative`}>
				<Header />
				<div className='flex-1 px-8 py-12 grid'>
					<main className=' max-w-7xl mx-auto w-full'>
						<ReservationProvider>{children}</ReservationProvider>
					</main>
				</div>
			</body>
		</html>
	);
}
