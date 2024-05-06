export const calculateElapsedTime = (start: Date | undefined, end: Date | undefined): string => {
	if (!start || !end) return 'No time selected';
	const elapsedTime = end.getTime() - start.getTime();
	const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
	const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));

	//build return string .make sure there are no 0 values on days, hours and minutes variables
	const daysString = days > 0 ? `${days}d` : '';
	const hoursString = hours > 0 ? `${hours}h` : '';
	const minutesString = minutes > 0 ? `${minutes}m` : '';

	return `${daysString} ${hoursString} ${minutesString}`;
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
	clients: {
		id: string;
		name: string;
		slug: string;
	};
}[];
