import { observer } from "mobx-react-lite";
import { game, ICell } from "../stores/game";
import { cn } from "../utils";
import styles from "./Cell.module.css";

interface CellProps {
	x: number;
	y: number;
	cell: ICell;
}

export const Cell = observer(function Cell({ x, y, cell }: CellProps) {
	let className = "";

	switch (cell.state) {
		case "hidden":
			className = styles.cell__hidden;
			break;
		case "flagged":
			className = styles.cell__flagged;
			break;
		case "questioned":
			className = styles.cell__questioned;
			break;
		case "revealed": {
			if (cell.isMine) {
				className = styles.cell__mine;
			} else {
				className = styles.cell__revealed;
			}
			break;
		}
	}

	if (game.state !== "playing") {
		if (cell.state === "flagged") {
			className = cell.isMine ? styles.cell__flagged : styles.cell__flaggedInvalid;
		} else if (cell.isFinal) {
			className = styles.cell__final;
		} else if (cell.isMine) {
			className = styles.cell__mine;
		}
	}

	return (
		<button
			className={cn(styles.cell, className)}
			data-mines={cell.minesCount}
			onClick={() => game.revealCell(x, y)}
			onContextMenu={event => {
				event.preventDefault();
				if ("vibrate" in navigator) {
					// audio/vibration cue for mobile users
					navigator.vibrate(100);
				}
				game.toggleCellState(x, y);
			}}
		/>
	);
});
