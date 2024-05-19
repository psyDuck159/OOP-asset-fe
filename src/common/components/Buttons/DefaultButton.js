import { Button } from "antd";
import React from "react";

const DefaultButton = props => {
	const { content, onClick } = props;

	return (
		<Button style={{ width: "100px" }} onClick={() => onClick()}>
			{content}
		</Button>
	);
};

export default DefaultButton;
