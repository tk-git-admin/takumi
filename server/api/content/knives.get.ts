import { fetchKurocoList } from '../../utils/kurocoFetch';

export default defineEventHandler((event) => fetchKurocoList(event, 'knives'));
