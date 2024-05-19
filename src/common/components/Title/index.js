import { Typography } from "antd";
import React from "react";

const Title = props => {
	const { content } = props;
	return (
		<>
			<Typography.Title style={{ color: "#cf2338" }} level={2}>
				{content}
			</Typography.Title>
		</>
	);
};

export default Title;
