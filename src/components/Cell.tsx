import { observer } from "mobx-react-lite";
import { MouseEvent } from "react";
import { game, ICell } from "../game";
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

	function handleClick(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (event.button === 0) {
			game.revealCell(x, y);
		} else if (event.button === 2) {
			game.toggleFlagged(x, y);
		}
	}

	return (
		<button
			className={cn(styles.cell, className)}
			data-mines={cell.minesCount}
			onClick={handleClick}
			onContextMenu={handleClick}
		/>
	);
});
