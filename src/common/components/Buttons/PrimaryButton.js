import { Button } from "antd";
import React from "react";

const PrimaryButton = props => {
	const { content, onClick } = props;

	return (
		<Button style={{ width: "100px" }} type="primary" danger onClick={() => onClick()}>
			{content}
		</Button>
	);
};

export default PrimaryButton;
