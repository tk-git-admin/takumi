const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createSessionSeatMap(experiences) {
	return experiences.reduce((seatMap, experience) => {
		experience.sessions.forEach((session) => {
			seatMap[session.id] = {
				booked: session.booked,
				capacity: session.capacity,
			};
		});
		return seatMap;
	}, {});
}

export function getRemainingSeats(seatMap, sessionId) {
	const session = seatMap[sessionId];
	if (!session) return 0;
	return Math.max(0, session.capacity - session.booked);
}

export function getBookedSeats(seatMap, sessionId) {
	const session = seatMap[sessionId];
	if (!session) return 0;
	return Math.max(0, session.booked);
}

export function getSeatPercent(seatMap, sessionId) {
	const session = seatMap[sessionId];
	if (!session || session.capacity === 0) return 0;
	return Math.min(100, Math.round((session.booked / session.capacity) * 100));
}

export function canReserveParticipants(seatMap, sessionId, participants) {
	const participantCount = Number(participants);
	return (
		Number.isInteger(participantCount) &&
		participantCount > 0 &&
		participantCount <= getRemainingSeats(seatMap, sessionId)
	);
}

export function isValidRegistration(form, remainingSeats) {
	const participantCount = Number(form.participants);
	return (
		String(form.name || '').trim().length > 0 &&
		EMAIL_PATTERN.test(String(form.email || '').trim()) &&
		Number.isInteger(participantCount) &&
		participantCount > 0 &&
		participantCount <= remainingSeats
	);
}

export function reserveParticipants(seatMap, sessionId, participants) {
	if (!canReserveParticipants(seatMap, sessionId, participants)) return false;
	seatMap[sessionId].booked += Number(participants);
	return true;
}
