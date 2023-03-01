import { useEffect, useState } from "react";

export function useNow() {
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		let raf: number | undefined = undefined;

		function update() {
			setNow(Date.now());
			raf = requestAnimationFrame(update);
		}

		raf = requestAnimationFrame(update);

		return () => {
			if (raf) {
				cancelAnimationFrame(raf);
			}
		};
	}, []);

	return Math.max(now, Date.now());
}
