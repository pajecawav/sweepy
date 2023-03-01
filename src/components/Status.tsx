import { observer } from "mobx-react-lite";
import { game } from "../game";
import { ControlButton } from "./ControlButton";
import { Count } from "./Count";
import styles from "./Status.module.css";
import { Timer } from "./Timer";

export const Status = observer(function Status() {
	return (
		<div className={styles.status}>
			<Count value={game.unflaggedMines} />
			<ControlButton />
			<Timer />
		</div>
	);
});
