import { observer } from "mobx-react-lite";
import { game } from "../stores/game";
import { useGameDuration } from "../hooks/useGameDuration";
import { Count } from "./Count";

export const Timer = observer(function Timer() {
	const duration = useGameDuration(game);
	return <Count value={duration / 1000} />;
});
