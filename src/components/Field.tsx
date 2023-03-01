import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { GRID_SIZE } from "../config";
import { game } from "../game";
import { Cell } from "./Cell";
import styles from "./Field.module.css";

export const Field = observer(function Field() {
	return (
		<div className={styles.field} style={{ ["--size" as string]: GRID_SIZE.toFixed() }}>
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
