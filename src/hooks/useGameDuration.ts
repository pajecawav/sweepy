import { Game } from "../game";
import { useNow } from "./useNow";

export function useGameDuration(game: Game) {
	const now = useNow();

	if (game.startedAt === null) {
		return 0;
	}

	if (game.endedAt !== null) {
		return game.endedAt - game.startedAt;
	}

	return now - game.startedAt;
}
