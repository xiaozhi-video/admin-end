export const toOriginal = (n: string) => {
	const a = n.indexOf('!')
	if (a === -1) return n
	return n.slice(0, a)
}
