import { CheckOutlined, CloseOutlined, CloseSquareOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ASSIGNMENT_STATES, RETURN_STATES } from "../../constants/states";
import { getMyAssignments } from "../../services/user.service";
import { respondAssignment } from "../../services/assignment.service";
import { useAuth } from "../../stores/AuthContext";
import AssignmentDetails from "../Assignment/components/AssignmentDetails";
import "./index.css";
import Title from "../../common/components/Title";
import PopUpDialog from "../../common/components/PopUpDialog";
import { createReturningRequest } from "../../services/return.service";
import { CONFIG } from "../../constants/config";

let counter = 0;
let selectedSortKey = "";
let selectedAssignmentData = {};
const DATE_FORMAT = "DD/MM/YYYY";

const HomePage = () => {
	moment.updateLocale(moment.locale(), { invalidDate: "" });
	const [tableLoading, setTableLoading] = useState(false);
	const [assignmentList, setAssignmentList] = useState([]);
	const [isShowAssignmentDetails, setIsShowAssignmentDetails] = useState(false);
	const [pageable, setPageable] = useState({
		page: 0,
		size: 10
	});
	const [pagination, setPagination] = useState({
		totalPages: 0,
		totalItems: 0
	});
	const [sortOptions, setSortOptions] = useState("");
	const [openRespond, setOpenRespond] = useState({
		visible: false,
		id: -1,
		state: ""
	});
	const [openReturn, setOpenReturn] = useState({
		visible: false,
		id: -1
	});

	const { user } = useAuth();

	useEffect(() => {
		fetchMyAssignmentList(user.username, {
			page: pageable.page,
			size: pageable.size,
			sort: sortOptions === "" || sortOptions === null ? null : sortOptions
		});
	}, [pageable, sortOptions]);

	const fetchMyAssignmentList = async (assigneeUsername, param) => {
		setTableLoading(true);
		await getMyAssignments(assigneeUsername, param)
			.then(res => {
				let content = res.data?.data?.contents;
				setAssignmentList(content);
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
			width: "20%",
			ellipsis: true
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
		},
		{
			title: "",
			width: "15%",
			key: "action",
			render: item => (
				<div>
					<Button
						style={{ border: "none", borderRadius: "10px", color: "red" }}
						disabled={item.state !== ASSIGNMENT_STATES.WAITING_FOR_ACCEPTED}
						onClick={e => handleAcceptAssignment(e, item)}
					>
						<CheckOutlined />
					</Button>
					<Button
						style={{ border: "none", borderRadius: "10px", color: "black" }}
						disabled={item.state !== ASSIGNMENT_STATES.WAITING_FOR_ACCEPTED}
						onClick={e => handleDeclineAssignment(e, item)}
					>
						<CloseOutlined />
					</Button>
					<Button
						style={{ border: "none", borderRadius: "10px", color: "blue" }}
						disabled={item.state !== ASSIGNMENT_STATES.ACCEPTED || isReturning(item)}
						onClick={e => handleOpenReturn(e, item)}
					>
						<UndoOutlined />
					</Button>
				</div>
			)
		}
	];

	const isReturning = asmItem => {
		return asmItem.returningRequests.find(req => req.state === RETURN_STATES.WAITING_FOR_RETURNING);
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
				setSortOptions(null);
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

	const handleChangePage = pageNumb => {
		setPageable({ ...pageable, page: pageNumb - 1 });
	};

	const handleAcceptAssignment = (event, record) => {
		event.stopPropagation();
		setOpenRespond({
			visible: true,
			id: record.id,
			state: ASSIGNMENT_STATES.ACCEPTED
		});
	};

	const handleDeclineAssignment = (event, record) => {
		event.stopPropagation();
		setOpenRespond({
			visible: true,
			id: record.id,
			state: ASSIGNMENT_STATES.DECLINED
		});
	};

	const handleOpenReturn = (event, record) => {
		event.stopPropagation();
		setOpenReturn({
			visible: true,
			id: record.id
		});
	};

	const handleSendRespond = () => {
		sendRespond(openRespond.id);
	};

	const handleCancel = () => {
		setOpenRespond({
			visible: false,
			id: -1,
			state: ""
		});
	};

	const sendRespond = async id => {
		respondAssignment(id, { state: openRespond.state })
			.then(res => {
				setAssignmentList(assignmentList.map(item => (item.id !== id ? item : { ...item, state: openRespond.state })));
				setOpenRespond({
					visible: false,
					id: -1,
					state: ""
				});
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleCreateReturn = () => {
		createReturningRequest({ assignment: { id: openReturn.id } })
			.then(res => {
				localStorage.setItem(CONFIG.NEW_RETURN, res.data.data);
				setAssignmentList(
					assignmentList.map(item =>
						item.id !== openReturn.id
							? item
							: { ...item, returningRequests: [{ state: RETURN_STATES.WAITING_FOR_RETURNING }] }
					)
				);
				setOpenReturn({
					visible: false,
					id: -1
				});
				message.success("Create returning requeset succesful");
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleCancelReturn = () => {
		setOpenReturn({
			visible: false,
			id: -1
		});
	};

	return (
		<React.Fragment>
			<div className="asm-container">
				<div className="asm-title">
					<Title content={"My Assignment"} />
				</div>
				<div className="asm-table">
					<Table
						columns={columns}
						dataSource={assignmentList.filter(item => item.state !== ASSIGNMENT_STATES.DECLINED)}
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
			<Modal
				title={<Title content={"Are you sure?"} />}
				closable={false}
				footer={false}
				open={openRespond.visible}
				centered
				destroyOnClose
			>
				<PopUpDialog
					primaryText={openRespond.state === ASSIGNMENT_STATES.ACCEPTED ? "Accept" : "Decline"}
					defaultText={"Cancel"}
					handlePrimaryClick={handleSendRespond}
					handleDefaultClick={handleCancel}
					content={
						openRespond.state === ASSIGNMENT_STATES.ACCEPTED
							? "Do you want to accept this assignment?"
							: "Do you want to decline this assignment?"
					}
				/>
			</Modal>
			<Modal
				title={<Title content="Are you sure?" />}
				closable={false}
				footer={false}
				open={openReturn.visible}
				centered
				destroyOnClose
			>
				<PopUpDialog
					primaryText={"Yes"}
					defaultText={"No"}
					content={"Do you want to create returning request for this asset?"}
					handlePrimaryClick={handleCreateReturn}
					handleDefaultClick={handleCancelReturn}
				/>
			</Modal>
		</React.Fragment>
	);
};

export default HomePage;
