// Copied from the frontend (src/) so both sides use the same retrieval rules.
const fmt = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' });
export const formatMoney = (n: number) => fmt.format(n);
