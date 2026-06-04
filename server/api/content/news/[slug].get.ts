import { fetchKurocoNewsDetails } from '../../../utils/kurocoFetch';

export default defineEventHandler((event) =>
	fetchKurocoNewsDetails(event, String(getRouterParam(event, 'slug') || '')),
);
