export const MY_TRIPS_EMPTY_MESSAGE = "You haven't booked any trips yet";

export const LANDING_NO_VEHICLES_MESSAGE = 'No vehicles match your search.';

export const LANDING_RESULTS_ALL = 'All vehicles';

export function landingResultsInLocation(count: number, location: string): string {
  const noun = count === 1 ? 'vehicle' : 'vehicles';
  return `${count} ${noun} in ${location}`;
}
