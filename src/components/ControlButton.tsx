import { observer } from "mobx-react-lite";
import { game } from "../game";
import { cn } from "../utils";
import styles from "./ControlButton.module.css";

export const ControlButton = observer(function ControlButton() {
	let className = "";

	switch (game.state) {
		case "completed":
			className = styles.button__completed;
			break;
		case "failed":
			className = styles.button__failed;
			break;
	}

	function handleClick() {
		game.restart();
	}

	return <button className={cn(styles.button, className)} onClick={handleClick} />;
});
