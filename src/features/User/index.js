import { Button, Input, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
import { USER_TYPES } from "../../constants/states";
import moment from "moment";
import { getAll } from "../../services/user.service";
import { EditOutlined, CloseCircleOutlined, CloseSquareOutlined } from "@ant-design/icons";
import UserDetails from "./components/UserDetails";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import { COMPONENT_PATHS } from "../../constants/componentPath";
import { CONFIG } from "../../constants/config";
import Title from "../../common/components/Title";

let counter = 0;
let selectedSortKey = "";
let selectedUserData = {};

const User = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [keyword, setKeyword] = useState(null);
	const [userType, setUserType] = useState(null);
	const [pageable, setPageable] = useState({
		page: 0,
		size: 10
	});
	const [pagination, setPagination] = useState({
		totalPages: 0,
		totalItems: 0
	});
	const [sortOptions, setSortOptions] = useState("first_name,asc");
	const [isShowUserDetails, setIsShowUserDetails] = useState(false);

	useEffect(() => {
		fetchUserList({
			keyword: keyword,
			type: userType,
			...pageable,
			sort: sortOptions
		});
	}, [keyword, userType, pageable, sortOptions]);

	const columns = [
		{
			title: "Staff Code",
			dataIndex: "staffCode",
			width: "10%",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			key: "staff_code"
		},
		{
			title: "Full Name",
			key: "first_name",
			sorter: true,
			ellipsis: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "30%",
			render: item => <div>{`${item.firstName} ${item.lastName}`}</div>
		},
		{
			title: "Username",
			dataIndex: "username",
			width: "15%",
			ellipsis: true,
			key: "username"
		},
		{
			title: "Joined Date",
			dataIndex: "jointDate",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "20%",
			key: "joint_date",
			render: date => <div>{moment(date).format("DD/MM/YYYY")}</div>
		},
		{
			title: "Type",
			dataIndex: "type",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "10%",
			key: "type"
		},
		{
			title: "",
			width: "15%",
			key: "action",
			render: (item, record) => (
				<div>
					<Button
						style={{ border: "none", borderRadius: "10px" }}
						onClick={e => {
							navigate(`${PATHS.USER}${COMPONENT_PATHS.UPDATE_USER}`.replace(":username", record.username));
						}}
					>
						<EditOutlined />
					</Button>
					<Button style={{ border: "none", borderRadius: "10px", color: "red" }}>
						<CloseCircleOutlined />
					</Button>
				</div>
			)
		}
	];

	const fetchUserList = async param => {
		setIsLoading(true);
		await getAll(param).then(res => {
			const newUser = JSON.parse(localStorage.getItem(CONFIG.NEW_USER));
			let content = res.data?.data?.contents;
			if (newUser) {
				setUserList([newUser, ...content.filter(user => user.username !== newUser.username)]);

				localStorage.removeItem(CONFIG.NEW_USER);
			} else {
				setUserList(content);
			}
			setIsLoading(false);
			setPagination({
				totalItems: res.data?.data?.totalItems,
				totalPages: res.data?.data?.totalPages
			});
		});
	};

	const handleChangeTypeFilter = e => {
		setUserType(e === "" ? null : e);
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangeSearchBar = e => {
		setKeyword(e.trim());
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangePage = pageNumb => {
		setPageable({ ...pageable, page: pageNumb - 1 });
	};

	const handleChangeSortKey = sortKey => {
		if (selectedSortKey === sortKey.key) {
			counter++;
		} else {
			selectedSortKey = sortKey.key;
			counter = 1;
		}
		let sortingKey;
		switch (counter % 3) {
			case 1:
				sortingKey = selectedSortKey;
				setSortOptions(sortingKey + ",asc");
				break;
			case 2:
				sortingKey = selectedSortKey;
				setSortOptions(sortingKey + ",desc");
				break;
			case 0:
				setSortOptions("first_name,asc");
				break;
			default:
				console.log("null default");
		}
	};

	const handleClickOnRow = value => {
		selectedUserData = value;
		setIsShowUserDetails(true);
	};

	const handleCloseUserDetailsModal = () => {
		setIsShowUserDetails(false);
	};

	const navToCreateUserPage = () => {
		navigate(`${PATHS.USER}${COMPONENT_PATHS.CREATE_USER}`);
	};

	return (
		<React.Fragment>
			<div className="user-container">
				<div className="user-title">
					<Title content={"User List"} />
				</div>
				<div className="user-function-bar">
					<Select
						placeholder="Type"
						style={{ width: "15%" }}
						onChange={handleChangeTypeFilter}
						options={[
							{
								value: "",
								label: "All"
							},
							{
								value: USER_TYPES.ADMIN,
								label: USER_TYPES.ADMIN
							},
							{
								value: USER_TYPES.STAFF,
								label: USER_TYPES.STAFF
							}
						]}
					/>
					<Input.Search onSearch={handleChangeSearchBar} style={{ width: "30%" }} />
					<Button type="primary" danger onClick={navToCreateUserPage}>
						Create New User
					</Button>
				</div>
				<div className="user-table">
					<Table
						columns={columns}
						dataSource={userList}
						rowKey={obj => obj.username}
						loading={isLoading}
						pagination={{
							current: pageable.page === 0 ? 1 : pageable.page + 1,
							total: pagination.totalItems,
							onChange: handleChangePage,
							position: "bottomRight",
							showSizeChanger: false
						}}
						onRow={record => {
							return {
								onClick: () => handleClickOnRow(record)
							};
						}}
					/>
				</div>
			</div>
			<Modal
				title={<Title content={"Detailed User Information"} />}
				closeIcon={
					<div style={{ color: "red" }}>
						<CloseSquareOutlined />
					</div>
				}
				open={isShowUserDetails}
				footer={false}
				onCancel={handleCloseUserDetailsModal}
				destroyOnClose
			>
				<UserDetails data={selectedUserData} />
			</Modal>
		</React.Fragment>
	);
};

export default User;
