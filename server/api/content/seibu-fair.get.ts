import { fetchSeibuFairEvent } from '../../utils/seibuFairFetch';

export default defineEventHandler((event) => fetchSeibuFairEvent(event));
