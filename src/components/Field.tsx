import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { GRID_SIZE } from "../config";
import { game } from "../stores/game";
import { pointer } from "../stores/pointer";
import { Cell } from "./Cell";
import styles from "./Field.module.css";

export const Field = observer(function Field() {
	function handlePress() {
		runInAction(() => {
			pointer.pressed = true;
		});
	}

	function handleRelease() {
		runInAction(() => {
			pointer.pressed = false;
		});
	}

	return (
		<div
			className={styles.field}
			style={{ ["--size" as string]: GRID_SIZE.toFixed() }}
			onPointerDown={handlePress}
			onPointerUp={handleRelease}
			onPointerLeave={handleRelease}
		>
			{game.grid.map((row, y) => (
				<Fragment key={y}>
					{row.map((cell, x) => (
						<Cell x={x} y={y} cell={cell} key={x} />
					))}
				</Fragment>
			))}
		</div>
	);
});
