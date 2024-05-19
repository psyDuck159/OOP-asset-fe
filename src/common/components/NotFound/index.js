import { Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../Buttons/PrimaryButton";
import { PATHS } from "../../../constants/paths";

const NotFound = () => {
	const navigate = useNavigate();

	const handleBackHome = () => {
		navigate(PATHS.HOME);
	};

	return (
		<React.Fragment>
			<div
				className="forbidden-container"
				style={{
					backgroundColor: "#cf2338",
					height: "100vh",
					width: "100vw",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<div
					className="forbidden-wrapper"
					style={{
						backgroundColor: "white",
						height: "50vh",
						width: "50vw",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<Typography.Title>404 Not Found</Typography.Title>
					<PrimaryButton content={"Back Home"} onClick={handleBackHome} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default NotFound;
