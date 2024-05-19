import { Col, Row, Typography, Spin, message, Table } from "antd";
import moment from "moment";
import React from "react";
import { getAssetDetails } from "../../../../services/asset.service";

const DATE_FORMAT = "DD/MM/YYYY";
const AssetDetails = props => {
	const { assetCode } = props;
	const [loading, setLoading] = React.useState(false);
	const [asset, setAsset] = React.useState({
		assetCode: assetCode,
		name: "",
		category: {},
		state: "",
		installedDate: moment(),
		specification: "",
		location: {},
		assignments: []
	});

	const columns = [
		{
			title: "Assignee",
			dataIndex: "assignee",
			key: "assignee"
		},
		{
			title: "Assigned Date",
			dataIndex: "assignedDate",
			key: "assignedDate"
		},
		{
			title: "Released Date",
			dataIndex: "returnedDate",
			key: "returnedDate"
		}
	];
	React.useEffect(() => {
		setLoading(true);
		getAssetDetails(assetCode)
			.then(res => {
				setLoading(false);
				setAsset(res.data.data);
			})
			.catch(err => {
				setLoading(false);
				message.error(err);
			});
	}, [assetCode]);

	moment.updateLocale(moment.locale(), { invalidDate: "---" });
	const convertAssignmentHistory = assignments =>
		assignments.map(asm => {
			return {
				assignee: `${asm.assignedTo.firstName} ${asm.assignedTo.lastName}`,
				assignedDate: moment(asm.assignedDate).format(DATE_FORMAT),
				returnedDate: moment(asm.returnedDate).format(DATE_FORMAT)
			};
		});

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
							<Typography.Paragraph>{asset.assetCode}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Asset Name</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{asset.name}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Category</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{asset.category.category}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>State</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{asset.state}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Installed Date</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{moment(asset.installedDate).format("DD/MM/YYYY")}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Specification</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{asset.specification}</Typography.Paragraph>
						</Col>
						<Col span={8} style={{ paddingLeft: 40 }}>
							<Typography.Paragraph>Location</Typography.Paragraph>
						</Col>
						<Col span={16}>
							<Typography.Paragraph>{asset.location?.name}</Typography.Paragraph>
						</Col>
					</Row>
					<Typography.Title level={5} style={{ color: "red" }}>
						Assignment History
					</Typography.Title>
					<Table
						columns={columns}
						rowKey={obj => obj.id}
						dataSource={convertAssignmentHistory(asset.assignments)}
						loading={loading}
						scroll={{
							y: 200
						}}
					/>
				</Typography>
			)}
		</React.Fragment>
	);
};

export default AssetDetails;
