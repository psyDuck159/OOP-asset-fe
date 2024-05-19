import { Col, message, Row, Spin, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getAssignmentDetails } from "../../../../services/assignment.service";
import "./index.css";

const DATE_FORMAT = "DD/MM/YYYY";
const AssignmentDetails = props => {
	const { id } = props;
	const [loading, setLoading] = useState(false);
	const [assignment, setAssignment] = useState({
		asset: {
			assetCode: "",
			name: "",
			specification: ""
		},
		assignedTo: { username: "" },
		assignedBy: { username: "" },
		assignedDate: {},
		state: "",
		note: ""
	});

	useEffect(() => {
		setLoading(true);
		getAssignmentDetails(id)
			.then(res => {
				setAssignment(res.data.data);
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
				message.error(err);
			});
	}, [id]);
	return (
		<React.Fragment>
			{loading ? (
				<Spin />
			) : (
				<Typography>
					<Row gutter={16}>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Asset Code</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment?.asset?.assetCode}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Asset Name</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment?.asset?.name}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Specification</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment.asset.specification}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Assigned to</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment?.assignedTo?.username}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Assigned by</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment?.assignedBy?.username}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Assigned Date</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{moment(assignment.assignedDate).format(DATE_FORMAT)}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>State</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment.state}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Note</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{assignment.note}</Typography.Paragraph>
						</Col>
					</Row>
				</Typography>
			)}
		</React.Fragment>
	);
};

export default AssignmentDetails;
