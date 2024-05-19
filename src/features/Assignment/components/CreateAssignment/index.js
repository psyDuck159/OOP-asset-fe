import { Card } from "antd";
import React from "react";
import "./index.css";
import CreateAssignmentForm from "./CreateAssignmentForm";
import Title from "../../../../common/components/Title";

const CreateAssignment = () => {
	return (
		<React.Fragment>
			<div className="create-assignemnt-container">
				<Card title={<Title content={"Create New Assignment"} />} style={{ minWidth: "700px", width: "50%" }}>
					<CreateAssignmentForm />
				</Card>
			</div>
		</React.Fragment>
	);
};

export default CreateAssignment;
