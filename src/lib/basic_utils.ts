export const calculateElapsedTime = (start: Date | undefined, end: Date | undefined): string => {
	if (!start || !end) return 'No time selected';
	const elapsedTime = end.getTime() - start.getTime();
	const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
	const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

	const daysString = days > 0 ? `${days}d` : '';
	const hoursString = hours > 0 ? `${hours}h` : '';
	const minutesString = minutes > 0 ? `${minutes}m` : '';
	const secondsString = seconds > 0 ? `${seconds}s` : '';

	return `${daysString} ${hoursString} ${minutesString} ${secondsString}`;
};

export type BasicType = {
	id: string;
	name: string;
	slug: string;
};

export type BasicProjectWithClients = {
	id: string;
	name: string;
	slug: string;
	clients: BasicType;
};

export type BasicProjectWithClientsAndSessions = {
	id: string;
	name: string;
	slug: string;
	clients: BasicType;
	sessions: {
		id: string;
		start: Date;
		end: Date;
		details: string;
		projects: BasicType;
		clients: BasicType;
	}[];
};
