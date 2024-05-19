import { Space, Typography } from "antd";
import React from "react";
import DefaultButton from "../Buttons/DefaultButton";
import PrimaryButton from "../Buttons/PrimaryButton";
import "./index.css";

const PopUpDialog = props => {
	const { handlePrimaryClick, handleDefaultClick, primaryText, defaultText, content } = props;
	return (
		<React.Fragment>
			<div className="popup-dialog">
				<Typography style={{ marginBottom: "30px", fontSize: 20 }}>{content}</Typography>
				<Space>
					<PrimaryButton content={primaryText} onClick={handlePrimaryClick} />
					<DefaultButton content={defaultText} onClick={handleDefaultClick} />
				</Space>
			</div>
		</React.Fragment>
	);
};

export default PopUpDialog;
