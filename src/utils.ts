export function cn(...values: any[]): string {
	return values.filter(value => typeof value === "string" && value).join(" ");
}

export function randint(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

export function* iterDeltas(): Generator<[dx: number, dy: number]> {
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (dx === 0 && dy === 0) {
				continue;
			}
			yield [dx, dy];
		}
	}
}
