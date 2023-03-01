import { makeAutoObservable } from "mobx";
import { GRID_SIZE, INITIAL_MINES_COUNT } from "./config";
import { iterDeltas, randint } from "./utils";

export type ICellState = "hidden" | "flagged" | "revealed";

export interface ICell {
	state: ICellState;
	isMine: boolean;
	isFinal: boolean;
	minesCount: number;
}

export type IGrid = ICell[][];

export type IGameState = "playing" | "completed" | "failed";

export class Game {
	startedAt: number | null = null;
	endedAt: number | null = null;
	state: IGameState = "playing";
	grid: IGrid = this.generateGrid();

	constructor() {
		makeAutoObservable(this);
	}

	get unflaggedMines(): number {
		let mines = INITIAL_MINES_COUNT;

		for (const cell of Game.iterCells(this.grid)) {
			if (cell.state === "flagged") {
				mines--;
			}
		}

		return mines;
	}

	get revealedCells(): number {
		let revealed = 0;

		for (const cell of Game.iterCells(this.grid)) {
			if (cell.state === "revealed") {
				revealed++;
			}
		}

		return revealed;
	}

	restart() {
		this.startedAt = null;
		this.endedAt = null;
		this.state = "playing";
		this.grid = this.generateGrid();
	}

	revealCell(x: number, y: number) {
		if (this.state !== "playing") {
			return;
		}

		const isFirstReveal = this.startedAt === null;
		this.startTimer();

		let targetCell = this.grid[y]?.[x];
		if (!targetCell || targetCell.state !== "hidden") {
			return;
		}

		while (isFirstReveal && targetCell.isMine) {
			// not a great solution but works ok for small minecount/size ratios
			this.grid = this.generateGrid();
			targetCell = this.grid[y][x];
		}

		targetCell.state = "revealed";

		if (targetCell.isMine) {
			targetCell.isFinal = true;
			this.failGame();
			return;
		}

		// reveal adjacent cells
		const stack: Array<[x: number, y: number]> = [];
		if (targetCell.minesCount === 0) {
			stack.push([x, y]);
		}
		while (stack.length) {
			const [cx, cy] = stack.pop()!;
			const cell = this.grid[cy][cx];

			if (cell.minesCount > 0) {
				continue;
			}

			for (const [adjCell, ax, ay] of Game.iterNeighbors(this.grid, cx, cy)) {
				if (adjCell.state === "hidden") {
					adjCell.state = "revealed";
					stack.push([ax, ay]);
				}
			}
		}

		// check win condition
		if (this.revealedCells === GRID_SIZE * GRID_SIZE - INITIAL_MINES_COUNT) {
			this.completeGame();
		}
	}

	toggleFlagged(x: number, y: number) {
		if (this.state !== "playing") {
			return;
		}

		const cell = this.grid[y]?.[x];
		if (!cell) {
			return;
		}

		this.startTimer();

		if (cell.state === "hidden") {
			cell.state = "flagged";
		} else if (cell.state === "flagged") {
			cell.state = "hidden";
		}
	}

	private startTimer() {
		this.startedAt ??= Date.now();
	}

	private endTimer() {
		this.endedAt = Date.now();
	}

	private completeGame() {
		this.state = "completed";
		this.endTimer();
	}

	private failGame() {
		this.state = "failed";
		this.endTimer();
	}

	private generateGrid(): IGrid {
		const grid = this.createEmptyGrid();
		this.generateMines(grid);
		this.updateMinesCounts(grid);
		return grid;
	}

	private createEmptyGrid(): IGrid {
		const grid: IGrid = [];

		// init empty cells
		for (let y = 0; y < GRID_SIZE; y++) {
			const row: ICell[] = [];

			for (let x = 0; x < GRID_SIZE; x++) {
				row.push({
					state: "hidden",
					isMine: false,
					isFinal: false,
					minesCount: 0,
				});
			}

			grid.push(row);
		}

		return grid;
	}

	private generateMines(grid: IGrid) {
		let totalMines = 0;
		while (totalMines < INITIAL_MINES_COUNT) {
			const y = randint(0, GRID_SIZE);
			const x = randint(0, GRID_SIZE);
			if (!grid[y][x].isMine) {
				grid[y][x].isMine = true;
				totalMines++;
			}
		}
	}

	private updateMinesCounts(grid: IGrid) {
		for (let y = 0; y < GRID_SIZE; y++) {
			for (let x = 0; x < GRID_SIZE; x++) {
				grid[y][x].minesCount = this.countMines(grid, x, y);
			}
		}
	}

	private countMines(grid: IGrid, x: number, y: number): number {
		let mines = 0;

		for (const [cell, dx, dy] of Game.iterNeighbors(grid, x, y)) {
			if (cell.isMine) {
				mines++;
			}
		}

		return mines;
	}

	private static *iterNeighbors(
		grid: IGrid,
		x: number,
		y: number
	): Generator<[cell: ICell, x: number, y: number]> {
		for (const [dx, dy] of iterDeltas()) {
			const cell = grid[y + dy]?.[x + dx];
			if (cell) {
				yield [cell, x + dx, y + dy];
			}
		}
	}

	private static *iterCells(grid: IGrid) {
		for (const row of grid) {
			for (const cell of row) {
				yield cell;
			}
		}
	}
}

export const game = new Game();
