import {auth} from '@/app/_lib/auth';

//The auth function from next-auth / auth.js itself is a middleware
export const middleware = auth;

// If we don't specify the matcher config, then the middleware will run on each route creating an infinite loop.
export const config = {
	// the middleware will run only on the routes specified inside the matcher array.
	matcher: ['/account'],
};
