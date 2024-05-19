import { Button, DatePicker, Input, message, Select, Table, Modal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useState } from "react";
import { getAllReturningRequest, respondRequestReturning } from "../../services/return.service";
import { RETURN_STATES } from "../../constants/states";
import Title from "../../common/components/Title";
import "./index.css";
import PopUpDialog from "../../common/components/PopUpDialog";


let counter = 0;
let selectedSortKey = "";
const DATE_FORMAT = "DD/MM/YYYY";

const ReturnAsset = () => {
	let getParams = {
		keyword: null,
		state: null,
		date: null,
		page: 0,
		size: 10,
		sort: null
	};
	moment.updateLocale(moment.locale(), { invalidDate: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [requestList, setRequestList] = useState([]);
	const [params, setParams] = useState(getParams);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		totalItems: 0
	});
	const [openRespond, setOpenRespond] = useState({
		visible: false,
		id: -1,
		state: ""
	});

	React.useEffect(() => {
		fetchRequestList(params);
	}, [params]);

	const fetchRequestList = async params => {
		setIsLoading(true);
		await getAllReturningRequest(params)
			.then(res => {
				setRequestList(res.data?.data?.contents);
				setPagination({
					...pagination,
					totalItems: res.data?.data?.totalItems,
					totalPages: res.data?.data?.totalPages
				});
				setIsLoading(false);
			})
			.catch(err => {
				setIsLoading(false);
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
			dataIndex: "assignment",
			width: "10%",
			sorter: true,
			key: "a.asset_code",
			render: assignment => assignment.asset.assetCode,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Asset Name",
			dataIndex: "assignment",
			sorter: true,
			width: "20%",
			ellipsis: true,
			key: "a.name",
			render: assignment => assignment.asset.name,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Requested by",
			width: "10%",
			dataIndex: "requestedBy",
			sorter: true,
			key: "requested_by",
			render: requestedBy => requestedBy.username,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Assigned Date",
			width: "10%",
			dataIndex: "assignment",
			sorter: true,
			key: "asm.assigned_date",
			render: assignment => moment(assignment.assignedDate).format(DATE_FORMAT),
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Accepted by",
			width: "10%",
			dataIndex: "acceptedBy",
			sorter: true,
			key: "accepted_by",
			render: acceptedBy => acceptedBy.username,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "Returned Date",
			width: "10%",
			dataIndex: "assignment",
			sorter: true,
			key: "asm.returned_date",
			render: assignment => moment(assignment.returnedDate).format(DATE_FORMAT),
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
			width: "15%",
			key: "state",
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "",
			width: "10%",
			key: "action",
			render: item => (
				<div>
					<Button 
						style={{ border: "none", borderRadius: "10px" }}
						disabled={item.state != RETURN_STATES.WAITING_FOR_RETURNING}
						onClick={e => handleCompleteReturningRequest(e, item)}
					>
						<CheckOutlined />
					</Button>
					<Button 
						style={{ border: "none", borderRadius: "10px", color: "red" }}
						disabled={item.state != RETURN_STATES.WAITING_FOR_RETURNING}
						onClick={e => handleCancelReturningRequest(e, item)}
					>
						<CloseOutlined />
					</Button>
				</div>
			)
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
				getParams.sort = sortingKey + ",asc";
				setParams(getParams);
				break;
			case 2:
				sortingKey = selectedSortKey;
				getParams.sort = sortingKey + ",desc";
				setParams(getParams);
				break;
			case 0:
				getParams.sort = null;
				setParams(getParams);
				break;
			default:
				console.log("null default");
		}
	};

	const handleReturnedDateFilter = e => {
		getParams.date = moment(e).format("YYYY-MM-DD").toString();
		getParams.page = 0;
		setParams(getParams);
	};

	const handleChangeStateFilter = e => {
		if (e.length === 0) {
			getParams.state = [RETURN_STATES.WAITING_FOR_RETURNING, RETURN_STATES.COMPLETED].join(",");
		} else {
			getParams.state = e.join(",");
		}
		getParams.page = 0;
		setParams(getParams);
	};

	const handleChangeSearchBar = e => {
		getParams.keyword = e.trim();
		getParams.page = 0;
		setParams(getParams);
	};

	const handleChangePage = pageNumb => {
		getParams.page = pageNumb - 1;
		setParams(getParams);
	};

	const handleCompleteReturningRequest = (event, record) => {
		event.stopPropagation();
		setOpenRespond({
			visible: true,
			id: record.id,
			state: RETURN_STATES.COMPLETED
		})
	}

	const handleCancelReturningRequest = (event, record) => {
		event.stopPropagation();
		setOpenRespond({
			visible: true,
			id: record.id,
			state: RETURN_STATES.CANCELED
		})
	}

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
		respondRequestReturning(id, {state: openRespond.state})
		.then(res => {
			fetchRequestList(params);
			setOpenRespond({
				visible: false,
				id: -1,
				state: ""
			});
		})
		.catch(err => {
			console.log(err);
		});
	}

	const handleClickOnRow = value => {

	};

	return (
		<React.Fragment>
			<div className="req-container">
				<div className="req-title">
					<Title content={"Request List"} />
				</div>
				<div className="req-function-bar">
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
									value: RETURN_STATES.WAITING_FOR_RETURNING,
									label: RETURN_STATES.WAITING_FOR_RETURNING
								},
								{
									value: RETURN_STATES.COMPLETED,
									label: RETURN_STATES.COMPLETED
								}
							]}
						/>
					</div>
					<DatePicker
						placeholder="Returned Date"
						allowClear={true}
						style={{ width: "20%" }}
						onChange={handleReturnedDateFilter}
						format={DATE_FORMAT}
					/>
					<Input.Search onSearch={handleChangeSearchBar} style={{ width: "30%" }} />
				</div>
				<div className="req-table">
					<Table
						columns={columns}
						dataSource={requestList}
						rowKey={obj => obj.id}
						pagination={{
							current: params.page === 0 ? 1 : params.page + 1,
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
						loading={isLoading}
					/>
				</div>
			</div>
			<Modal
				title={<Title content={"Are you sure?"} />}
				closable={false}
				footer={false}
				open={openRespond.visible}
				centered
				destroyOnClose
			>
				<PopUpDialog
					primaryText={openRespond.state === RETURN_STATES.COMPLETED ? "Completed" : "Canceled"}
					defaultText={"Cancel"}
					handlePrimaryClick={handleSendRespond}
					handleDefaultClick={handleCancel}
					content={
						openRespond.state === RETURN_STATES.COMPLETED 
							? "Do you want to approve this returning request?"
							: "Do you want to cancel this returning request?"
					}
				/>
			</Modal>
		</React.Fragment>
	);
};

export default ReturnAsset;
