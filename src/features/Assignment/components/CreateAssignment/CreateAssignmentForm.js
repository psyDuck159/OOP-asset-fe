import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../../../services/user.service";
import { getAllAssets } from "../../../../services/asset.service";
import { createAssignment } from "../../../../services/assignment.service";
import { CONFIG } from "../../../../constants/config";
import { PATHS } from "../../../../constants/paths";
import { Button, DatePicker, Form, Input, message, Modal, Select, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ASSET_STATES } from "../../../../constants/states";
import SearchUserDropdown from "./SearchUserDropdown";
import SearchAssetDropdown from "./SearchAssetDropdown";

const layout = {
	labelCol: {
		span: 4,
		offset: 1
	},
	wrapperCol: {
		span: 16,
		offset: 1
	}
};

const schema = yup
	.object({
		assignedTo: yup.string().required("User is required"),
		assetCode: yup.string().required("Asset is required"),
		assignedDate: yup.date().required("Assigned Date is required").nullable(),
		note: yup.string().trim().max(500, "You can enter at most 500 characters")
	})
	.required();

const CreateAssignmentForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [userList, setUserList] = useState([]);
	const [assetList, setAssetList] = useState([]);
	const [openSearchUser, setOpenSearchUser] = useState(false);
	const [openSearchAsset, setOpenSearchAsset] = useState(false);
	const navigate = useNavigate();
	moment.locale("vi");

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		setValue
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange"
	});

	useEffect(() => {
		fetchUserList({
			page: 0,
			size: 1000
		});
		fetchAssetList({
			page: 0,
			size: 1000
		});
	}, []);

	const fetchUserList = async params => {
		getAll(params)
			.then(res => {
				setUserList(res.data.data.contents);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const fetchAssetList = async params => {
		getAllAssets(params)
			.then(res => {
				setAssetList(res.data.data.contents);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const onFinish = async data => {
		setIsLoading(true);
		data.assignedDate = moment(data.assignedDate).format("yyyy-MM-DD");
		try {
			await createAssignment(data).then(res => {
				setIsLoading(false);
				reset();
				localStorage.setItem(CONFIG.NEW_ASSIGNMENT, JSON.stringify(res.data.data));
				navigate(PATHS.ASSIGNMENT);
			});
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			message.error("An error has occurred. Please try again");
		}
	};

	const handleCancel = () => {
		navigate(PATHS.ASSIGNMENT);
	};

	const disabledDate = current => {
		return current < moment().startOf("day");
	};

	const handleOpenSearchUser = () => {
		setOpenSearchUser(true);
	};

	const handleOpenSearchAsset = () => {
		setOpenSearchAsset(true);
	};

	const handleCloseSearchUser = () => {
		setOpenSearchUser(false);
	};

	const handleCloseSearchAsset = () => {
		setOpenSearchAsset(false);
	};

	const setUserFieldValue = value => {
		setValue("assignedTo", value);
		setOpenSearchUser(false);
	};

	const setAssetFieldValue = value => {
		setValue("assetCode", value);
		setOpenSearchAsset(false);
	};

	return (
		<React.Fragment>
			<Form {...layout} colon={false} onFinish={handleSubmit(onFinish)} noValidate autoComplete="off">
				<Controller
					name="assignedTo"
					control={control}
					defaultValue={""}
					render={({ field }) => (
						<Form.Item required label="User" labelAlign="left" validateStatus={errors?.assignedTo?.message && "error"}>
							<Select
								{...field}
								showSearch
								suffixIcon={
									<Button style={{ borderLeft: "none", borderRight: "none" }} onClick={handleOpenSearchUser}>
										<SearchOutlined />
									</Button>
								}
								filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
								options={userList
									.filter(item => item.isEnable === true)
									.map(item => {
										return {
											value: item.username,
											label: `${item.firstName} ${item.lastName}`
										};
									})}
							/>
							{errors?.assignedTo?.message && (
								<Typography.Text type="danger">{errors?.assignedTo?.message}</Typography.Text>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="assetCode"
					control={control}
					defaultValue={""}
					render={({ field }) => (
						<Form.Item required label="Asset" labelAlign="left" validateStatus={errors?.assetCode?.message && "error"}>
							<Select
								{...field}
								showSearch
								filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
								suffixIcon={
									<Button style={{ borderLeft: "none", borderRight: "none" }} onClick={handleOpenSearchAsset}>
										<SearchOutlined />
									</Button>
								}
								options={assetList
									.filter(item => item.state === ASSET_STATES.AVAILABLE)
									.map(item => {
										return {
											value: item.assetCode,
											label: item.name
										};
									})}
							/>
							{errors?.assetCode?.message && (
								<Typography.Text type="danger">{errors?.assetCode?.message}</Typography.Text>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="assignedDate"
					control={control}
					defaultValue={moment(new Date())}
					render={({ field }) => (
						<Form.Item
							required
							label="Assigned Date"
							labelAlign="left"
							validateStatus={errors?.assignedDate?.message && "error"}
						>
							<DatePicker {...field} disabledDate={disabledDate} format={"DD/MM/YYYY"} style={{ width: "100%" }} />
							{errors?.assignedDate?.message && (
								<Typography.Text type="danger">{errors?.assignedDate?.message}</Typography.Text>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="note"
					control={control}
					defaultValue={""}
					render={({ field }) => (
						<Form.Item label="Note" labelAlign="left" validateStatus={errors?.note?.message && "error"}>
							<Input.TextArea rows={4} {...field} />
							{errors?.note?.message && <Typography.Text type="danger">{errors?.note?.message}</Typography.Text>}
						</Form.Item>
					)}
				/>
				<div className="submit-button" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<Form.Item>
						<Space>
							<Button
								style={{ width: 100 }}
								danger
								type="primary"
								htmlType="submit"
								loading={isLoading}
								disabled={!isValid}
							>
								Save
							</Button>
							<Button style={{ width: 100 }} onClick={handleCancel}>
								Cancel
							</Button>
						</Space>
					</Form.Item>
				</div>
			</Form>
			<Modal mask={false} footer={false} closable={false} open={openSearchUser} width={"40%"} centered destroyOnClose>
				<SearchUserDropdown onCancel={handleCloseSearchUser} setValue={setUserFieldValue} />
			</Modal>

			<Modal mask={false} footer={false} closable={false} open={openSearchAsset} width={"40%"} centered destroyOnClose>
				<SearchAssetDropdown onCancel={handleCloseSearchAsset} setValue={setAssetFieldValue} />
			</Modal>
		</React.Fragment>
	);
};

export default CreateAssignmentForm;
