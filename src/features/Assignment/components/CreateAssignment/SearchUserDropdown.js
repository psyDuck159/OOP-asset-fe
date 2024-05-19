import { Button, Card, Input, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import Title from "../../../../common/components/Title";
import { getAll } from "../../../../services/user.service";

const columns = [
	{
		title: "Staff Code",
		dataIndex: "staffCode",
		sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
		key: "staffCode"
	},
	{
		title: "Full Name",
		key: "fullName",
		ellipsis: true,
		sorter: (a, b) => a.lastName.localeCompare(b.lastName),
		render: item => <div>{`${item.firstName} ${item.lastName}`}</div>
	},
	{
		title: "Type",
		dataIndex: "type",
		sorter: (a, b) => a.type.localeCompare(b.type),
		key: "type"
	}
];

let selectedUser = "";

const rowSelection = {
	onChange: selectedRowKeys => {
		selectedUser = selectedRowKeys[0];
	}
};

const SearchUserDropdown = props => {
	const [userList, setUserList] = useState([]);
	const [keyword, setKeyword] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { onCancel, setValue } = props;

	useEffect(() => {
		fetchUserList({
			page: 0,
			size: 1000,
			keyword: keyword
		});
	}, [keyword]);

	const fetchUserList = async params => {
		setIsLoading(true);

		await getAll(params)
			.then(res => {
				setUserList(res.data.data.contents);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const handleChangeSearch = value => {
		setKeyword(value.trim());
	};

	const handleSave = () => {
		setValue(selectedUser);
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<React.Fragment>
			<Card title={<Title content={"Select User"} />} extra={<Input.Search onSearch={handleChangeSearch} />}>
				<Table
					dataSource={userList.filter(item => item.isEnable === true)}
					columns={columns}
					rowKey={obj => obj.username}
					pagination={false}
					loading={isLoading}
					scroll={{
						y: 500
					}}
					rowSelection={{
						type: "radio",
						...rowSelection
					}}
				/>
				<div
					className="button-wrapper"
					style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "20px" }}
				>
					<Space>
						<Button style={{ width: 100, borderRadius: "6px" }} danger type="primary" onClick={handleSave}>
							Save
						</Button>
						<Button style={{ width: 100, borderRadius: "6px" }} onClick={handleCancel}>
							Cancel
						</Button>
					</Space>
				</div>
			</Card>
		</React.Fragment>
	);
};

export default SearchUserDropdown;
