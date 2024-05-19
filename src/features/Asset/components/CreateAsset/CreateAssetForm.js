import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Button, DatePicker, Divider, Form, Input, message, Modal, Radio, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ASSET_STATES } from "../../../../constants/states";
import moment from "moment";
import { createAsset } from "../../../../services/asset.service";
import { getAllCategories } from "../../../../services/category.service";
import Title from "../../../../common/components/Title";
import CreateCategoryForm from "./CreateCategoryForm";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../constants/paths";
import { CONFIG } from "../../../../constants/config";

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
		name: yup.string().required("Name is required").max(255, "Maximum name length is 255 characters"),
		category: yup.string().required("Category is required"),
		specification: yup
			.string()
			.required("Specification is required")
			.max(500, "Maximum specification length is 500 characters"),
		installedDate: yup.date().required("Installed Date is required").nullable(),
		state: yup.string().required("State is required")
	})
	.required();

const CreateAssetForm = () => {
	const navigate = useNavigate();
	moment.locale("vi");
	const [isLoading, setIsLoading] = useState(false);
	const [categoryList, setCategoryList] = useState([]);
	const [openCreateCate, setOpenCreateCate] = useState(false);

	useEffect(() => {
		fetchCategories();
	}, []);

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange"
	});

	const fetchCategories = async () => {
		await getAllCategories().then(res => {
			setCategoryList(res?.data?.data);
		});
	};

	const handleCloseCreateCategory = () => {
		setOpenCreateCate(false);
	};

	const onFinish = async data => {
		setIsLoading(true);
		data.installedDate = moment(data.installedDate).format("yyyy-MM-DD");
		data.name = data.name.replace(/\s+/g, " ").trim();
		data.specification = data.specification.replace(/\s+/g, " ").trim();
		try {
			await createAsset(data).then(res => {
				setIsLoading(false);
				reset();
				localStorage.setItem(CONFIG.NEW_ASSET, JSON.stringify(res.data.data));
				navigate(PATHS.ASSET);
			});
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			message.error("An error has occurred. Please try again");
		}
	};

	const handleCancel = () => {
		navigate(PATHS.ASSET);
	};

	const handleCreateCategory = data => {
		setCategoryList([data, ...categoryList]);
	};

	return (
		<React.Fragment>
			<Form {...layout} colon={false} onFinish={handleSubmit(onFinish)} autoComplete="off" noValidate>
				<Controller
					name="name"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Form.Item required label="Name" labelAlign="left" validateStatus={errors?.name?.message && "error"}>
							<Input {...field} />
							{errors?.name?.message && <div style={{ color: "#ff4d4f" }}>{errors?.name?.message}</div>}
						</Form.Item>
					)}
				/>
				<Controller
					name="category"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Form.Item
							required
							label="Category"
							labelAlign="left"
							validateStatus={errors?.category?.message && "error"}
						>
							<Select
								{...field}
								dropdownRender={menu => (
									<>
										{menu}
										<Divider style={{ margin: "8px 0" }} />
										<Space
											style={{ padding: "0 8px 4px", display: "flex", justifyContent: "center", alignItems: "center" }}
										>
											<Button icon={<PlusOutlined />} onClick={() => setOpenCreateCate(true)}>
												Add New Category
											</Button>
										</Space>
									</>
								)}
								options={categoryList.map(item => ({
									label: item.category,
									value: item.prefix
								}))}
							/>
							{errors?.category?.message && (
								<div style={{ color: "#ff4d4f" }} type="danger">
									{errors?.category?.message}
								</div>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="specification"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Form.Item
							required
							label="Specification"
							labelAlign="left"
							validateStatus={errors?.specification?.message && "error"}
						>
							<Input.TextArea {...field} rows={4} />
							{errors?.specification?.message && (
								<div style={{ color: "#ff4d4f" }} type="danger">
									{errors?.specification?.message}
								</div>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="installedDate"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<Form.Item
							required
							label="Installed Date"
							labelAlign="left"
							validateStatus={errors?.installedDate?.message && "error"}
						>
							<DatePicker {...field} placeholder="" format={"DD/MM/YYYY"} style={{ width: "100%" }} />
							{errors?.installedDate?.message && (
								<div style={{ color: "#ff4d4f" }} type="danger">
									{errors?.installedDate?.message}
								</div>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="state"
					control={control}
					defaultValue={ASSET_STATES.AVAILABLE}
					render={({ field }) => (
						<Form.Item required label="State" labelAlign="left" validateStatus={errors?.state?.message && "error"}>
							<Radio.Group {...field}>
								<Radio value={ASSET_STATES.AVAILABLE}>{ASSET_STATES.AVAILABLE}</Radio>
								<Radio value={ASSET_STATES.NOT_AVAILABLE}>{ASSET_STATES.NOT_AVAILABLE}</Radio>
							</Radio.Group>
							{errors?.state?.message && (
								<div style={{ color: "#ff4d4f" }} type="danger">
									{errors?.state?.message}
								</div>
							)}
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
			<Modal
				title={<Title content={"Create New Category"} />}
				open={openCreateCate}
				onCancel={handleCloseCreateCategory}
				footer={false}
				closable={false}
				destroyOnClose
			>
				<CreateCategoryForm onCancel={handleCloseCreateCategory} onCreate={handleCreateCategory} />
			</Modal>
		</React.Fragment>
	);
};

export default CreateAssetForm;
