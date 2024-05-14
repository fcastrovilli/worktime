declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			user_session: import('lucia').Session | null;
		}
	}
}

export {};
