import { fetchKurocoDetails } from '../../utils/kurocoFetch';

export default defineEventHandler((event) => fetchKurocoDetails(event, 'home'));
