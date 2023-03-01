import styles from "./Count.module.css";

interface CountProps {
	value: number;
}

export const Count = ({ value }: CountProps) => {
	const digits = Math.min(999, value).toFixed(0).padStart(3, "0").split("");

	return (
		<div className={styles.count}>
			{digits.map((digit, index) => (
				<span data-digit={digit} key={index} />
			))}
		</div>
	);
};
