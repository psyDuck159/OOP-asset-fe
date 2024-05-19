import { Button, Form, Input, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { createCategory, checkExistByPrefix, checkExistByCategory } from "../../../../services/category.service";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const layout = {
	labelCol: {
		span: 5,
		offset: 1
	},
	wrapperCol: {
		span: 16
	}
};

const schema = yup
	.object({
		prefix: yup
			.string()
			.required("Prefix is required")
			.max(2, "Prefix contains only 2 characters")
			.matches(/^[A-Z]+$/, "Prefix contains only upper case characters"),
		category: yup.string().required("Category is required").max(255, "Category contains only 255 characters")
	})
	.required();

const CreateCategoryForm = props => {
	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		watch,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			prefix: "",
			category: ""
		},
		mode: "onChange"
	});

	const { onCancel, onCreate } = props;
	const [showPrefixError, setShowPrefixError] = useState(false);
	const [showCategoryError, setShowCategoryError] = useState(false);

	useEffect(() => {
		const subscription = watch(data => {
			if (data.prefix.length === 2) {
				checkExistByPrefix(data.prefix).then(res => {
					setShowPrefixError(res.data);
				});
			} else {
				setShowPrefixError(false);
			}
			if (data.category.trim().length > 0) {
				checkExistByCategory(data.category).then(res => {
					setShowCategoryError(res.data);
				});
			} else {
				setShowCategoryError(false);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [watch]);

	const onFinish = async data => {
		try {
			await createCategory(data).then(res => {
				handleCancel();
				onCreate(res.data?.data);
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleCancel = () => {
		reset();
		onCancel();
	};

	return (
		<React.Fragment>
			<div className="form-wrapper">
				<Form {...layout} colon={false} onFinish={handleSubmit(onFinish)} autoComplete="off" noValidate>
					<Controller
						name="prefix"
						control={control}
						// defaultValue=""
						render={({ field }) => (
							<Form.Item
								required
								label="Prefix"
								labelAlign="left"
								validateStatus={(errors?.prefix?.message || showPrefixError) && "error"}
							>
								<Input {...field} />
								{errors?.prefix?.message && <Typography.Text type="danger">{errors?.prefix?.message}</Typography.Text>}
								{showPrefixError && (
									<Typography.Text type="danger">
										Prefix is already existed. Please enter a different prefix
									</Typography.Text>
								)}
							</Form.Item>
						)}
					/>
					<Controller
						name="category"
						control={control}
						// defaultValue=""
						render={({ field }) => (
							<Form.Item
								required
								label="Category"
								labelAlign="left"
								validateStatus={(errors?.category?.message || showCategoryError) && "error"}
							>
								<Input {...field} />
								{errors?.category?.message && (
									<Typography.Text type="danger">{errors?.category?.message}</Typography.Text>
								)}
								{showCategoryError && (
									<Typography.Text type="danger">
										Category is already existed. Please enter a different category
									</Typography.Text>
								)}
							</Form.Item>
						)}
					/>
					<div className="submit-button" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Form.Item>
							<Space>
								<Button
									danger
									type="primary"
									htmlType="submit"
									disabled={!isValid || showPrefixError || showCategoryError}
								>
									<CheckOutlined />
								</Button>
								<Button onClick={handleCancel}>
									<CloseOutlined />
								</Button>
							</Space>
						</Form.Item>
					</div>
				</Form>
			</div>
		</React.Fragment>
	);
};

export default CreateCategoryForm;
