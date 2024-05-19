import { CloseCircleOutlined, CloseSquareOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, message, Modal, Select, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COMPONENT_PATHS } from "../../constants/componentPath";
import { CONFIG } from "../../constants/config";
import { PATHS } from "../../constants/paths";
import { ASSIGNMENT_STATES } from "../../constants/states";
import { getAssignments } from "../../services/assignment.service";
import AssignmentDetails from "./components/AssignmentDetails";
import Title from "../../common/components/Title";
import "./index.css";

let counter = 0;
let selectedSortKey = "";
let selectedAssignmentData = {};

const DATE_FORMAT = "DD/MM/YYYY";
const Assignment = () => {
	moment.updateLocale(moment.locale(), { invalidDate: "" });
	const navigate = useNavigate();
	const [tableLoading, setTableLoading] = useState(false);
	const [assignmentList, setAssignmentList] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [assignedDate, setAssignedDate] = useState("");
	const [assignmentState, setAssignmentState] = useState("");
	const [pageable, setPageable] = useState({
		page: 0,
		size: 10
	});
	const [pagination, setPagination] = useState({
		totalPages: 0,
		totalItems: 0
	});
	const [sortOptions, setSortOptions] = useState("a.name");
	const [isShowAssignmentDetails, setIsShowAssignmentDetails] = useState(false);

	React.useEffect(() => {
		fetchAssignmentList({
			keyword: keyword === "" ? null : keyword,
			assignedDate: assignedDate === "" ? null : assignedDate,
			state: assignmentState === "" ? null : assignmentState,
			page: pageable.page,
			size: pageable.size,
			sort: sortOptions === "" || sortOptions === null ? null : sortOptions
		});
	}, [keyword, assignedDate, assignmentState, pageable, sortOptions]);

	const fetchAssignmentList = async param => {
		setTableLoading(true);
		await getAssignments(param)
			.then(res => {
				const newAssignment = JSON.parse(localStorage.getItem(CONFIG.NEW_ASSIGNMENT));
				let content = res.data?.data?.contents;
				if (newAssignment) {
					setAssignmentList([newAssignment, ...content.filter(asm => asm.id !== newAssignment.id)]);

					localStorage.removeItem(CONFIG.NEW_ASSIGNMENT);
				} else {
					setAssignmentList(content);
				}
				setPagination({
					...pagination,
					totalItems: res.data?.data?.totalItems,
					totalPages: res.data?.data?.totalPages
				});
				setTableLoading(false);
			})
			.catch(err => {
				setTableLoading(false);
				message.error(err);
			});
	};

	const columns = [
		{
			title: "No.",
			dataIndex: "id",
			width: "5%",
			sorter: true,
			key: "id",
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Asset Code",
			dataIndex: "asset",
			width: "10%",
			sorter: true,
			render: asset => asset.assetCode,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			key: "a.asset_code"
		},
		{
			title: "Asset Name",
			key: "a.name",
			dataIndex: "asset",
			render: asset => asset.name,
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "25%",
			ellipsis: true
		},
		{
			title: "Assigned to",
			width: "10%",
			dataIndex: "assignedTo",
			key: "assigned_to",
			render: assignedTo => assignedTo.username,
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Assigned by",
			width: "10%",
			dataIndex: "assignedBy",
			key: "assigned_by",
			render: assignedBy => assignedBy.username,
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Assigned Date",
			width: "10%",
			key: "assigned_date",
			dataIndex: "assignedDate",
			sorter: true,
			render: date => moment(date).format(DATE_FORMAT),
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "State",
			dataIndex: "state",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "15%",
			key: "state"
		}
	];

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
				setSortOptions("a.name");
				break;
			default:
				console.log("null default");
		}
	};

	const handleClickOnRow = value => {
		selectedAssignmentData = value;
		setIsShowAssignmentDetails(true);
	};

	const handleCloseAssignmentDetailsModal = () => {
		setIsShowAssignmentDetails(false);
	};

	const handleAssignedDateFilter = e => {
		setAssignedDate(moment(e).format("YYYY-MM-DD").toString());
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangeStateFilter = e => {
		if (e.length === 0) {
			setAssignmentState(
				[ASSIGNMENT_STATES.WAITING_FOR_ACCEPTED, ASSIGNMENT_STATES.ACCEPTED, ASSIGNMENT_STATES.DECLINED].join(",")
			);
		} else {
			setAssignmentState(e.join(","));
		}
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangeSearchBar = e => {
		setKeyword(e.trim());
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangePage = pageNumb => {
		setPageable({ ...pageable, page: pageNumb - 1 });
	};

	const navToCreateAssetPage = () => {
		navigate(PATHS.ASSIGNMENT + COMPONENT_PATHS.CREATE_ASSIGNMENT);
	};

	return (
		<React.Fragment>
			<div className="asm-container">
				<div className="asm-title">
					<Title content={"Assignment List"} />
				</div>
				<div className="asm-function-bar">
					<div style={{ width: "20%" }}>
						<Select
							placeholder="State"
							mode="multiple"
							maxTagCount={1}
							maxTagTextLength={8}
							allowClear={true}
							style={{ width: "100%" }}
							onChange={handleChangeStateFilter}
							showSearch={false}
							options={[
								{
									value: ASSIGNMENT_STATES.WAITING_FOR_ACCEPTED,
									label: ASSIGNMENT_STATES.WAITING_FOR_ACCEPTED
								},
								{
									value: ASSIGNMENT_STATES.ACCEPTED,
									label: ASSIGNMENT_STATES.ACCEPTED
								},
								{
									value: ASSIGNMENT_STATES.DECLINED,
									label: ASSIGNMENT_STATES.DECLINED
								}
							]}
						/>
					</div>
					<DatePicker
						placeholder="Assigned Date"
						allowClear={true}
						style={{ width: "20%" }}
						onChange={handleAssignedDateFilter}
						format={DATE_FORMAT}
					/>
					<Input.Search onSearch={handleChangeSearchBar} style={{ width: "30%" }} />
					<Button type="primary" danger onClick={navToCreateAssetPage}>
						Create New Assignment
					</Button>
				</div>
				<div className="asm-table">
					<Table
						columns={columns}
						dataSource={assignmentList}
						rowKey={obj => obj.id}
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
						loading={tableLoading}
					/>
				</div>
			</div>
			<Modal
				title={<Title content={"Detailed Assignment Information"} />}
				closeIcon={
					<div style={{ color: "red" }}>
						<CloseSquareOutlined />
					</div>
				}
				open={isShowAssignmentDetails}
				footer={false}
				onCancel={handleCloseAssignmentDetailsModal}
				destroyOnClose
			>
				<AssignmentDetails id={selectedAssignmentData.id} />
			</Modal>
		</React.Fragment>
	);
};

export default Assignment;
