import { Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";

const UserDetails = props => {
	const { data } = props;
	return (
		<React.Fragment>
			<Typography>
				<Row gutter={16}>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Staff Code</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{data.staffCode}</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Full Name</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>
							{data.firstName} {data.lastName}
						</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Username</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{data.username}</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Date of Birth</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{moment(data.dob).format("DD/MM/YYYY")}</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Gender</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{data.gender}</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Type</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{data.type}</Typography.Paragraph>
					</Col>
					<Col span={8} style={{ paddingLeft: 40 }}>
						<Typography.Paragraph>Location</Typography.Paragraph>
					</Col>
					<Col span={16}>
						<Typography.Paragraph>{data.location?.name}</Typography.Paragraph>
					</Col>
				</Row>
			</Typography>
		</React.Fragment>
	);
};

export default UserDetails;
