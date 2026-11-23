/** Base path of the static export (GitHub Pages sub-folder). Use it for plain <img>/<a> asset URLs. */
export const BASE_PATH = '/shoplite-ai';
export const asset = (p: string) => `${BASE_PATH}${p.startsWith('/') ? p : '/' + p}`;
