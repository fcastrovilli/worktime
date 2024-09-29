export const calculateElapsedTime = (
	start: Date | number,
	end: Date | undefined = undefined
): string => {
	if (!start) return 'No time selected';
	if (end && !(end instanceof Date)) return 'Invalid end date';
	const elapsedTime: number = end
		? end.getTime() - (start instanceof Date ? start.getTime() : start)
		: (start as number);
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
	pricehour: number;
	budget: number;
};

export type BasicProjectWithClientsAndSessions = {
	id: string;
	name: string;
	slug: string;
	clients: BasicType;
	pricehour: number;
	budget: number;
	sessions: {
		id: string;
		start: Date;
		end: Date;
		details: string;
		projects: BasicType;
		clients: BasicType;
	}[];
};
