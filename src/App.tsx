import { Field } from "./components/Field";
import { Status } from "./components/Status";

export default function App() {
	return (
		<div className="game">
			<Status />
			<Field />
		</div>
	);
}
