import { Card } from "antd";
import React from "react";
import Title from "../../../../common/components/Title";
import CreateAssetForm from "./CreateAssetForm";
import "./index.css";

const CreateAsset = () => {
	return (
		<React.Fragment>
			<div className="create-asset-container">
				<Card title={<Title content={"Create New Asset"} />} style={{ minWidth: "700px", width: "50%" }}>
					<CreateAssetForm />
				</Card>
			</div>
		</React.Fragment>
	);
};

export default CreateAsset;
