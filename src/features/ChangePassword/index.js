import { Button, Form, Input, Typography } from "antd";
import React, { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { changePassword } from "../../services/auth.service";
import { useAuth } from "../../stores/AuthContext";
import { useState } from "react";

const layout = {
	labelCol: {
		span: 6,
		offset: 1
	},
	wrapperCol: {
		span: 15,
		offset: 1
	}
};

const schema = yup
	.object({
		currentPassword: yup.string().required("Old password is required"),
		newPassword: yup.string().required("New password is required")
	})
	.required();

const ChangePassword = props => {
	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema)
	});
	const { unauthenticate } = useAuth();
	const [stage, setStage] = useState(1);
	const [showError, setShowError] = useState("");
	const [newPasswordError, setNewPasswordError] = useState("");

	useEffect(() => {
		const subscription = watch(data => {
			if (data.currentPassword === "") {
				setShowError("");
			}
			if (data.newPassword === "") {
				setNewPasswordError("");
			}
			return () => subscription.unsubscribe();
		});
	}, [watch]);

	const onFinish = async data => {
		setShowError("");
		setNewPasswordError("");

		await changePassword(data)
			.then(() => {
				setStage(2);
			})
			.catch(err => {
				setShowError(err.response.data.message.includes("incorrect") ? err.response.data.message : "");
			});

		if (!data.newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/g)) {
			setNewPasswordError(
				"Password must contain at least eight characters, including at least one number and includes both lower and uppercase letters and special characters"
			);
			return;
		}

		if (data.newPassword === data.currentPassword) {
			setNewPasswordError("Can't reuse current password!");
			return;
		}
	};

	const handleCancel = () => {
		props.onCancel();
		setShowError("");
		setNewPasswordError("");
		reset();
	};

	const handleClose = () => {
		props.onCancel();
		setStage(1);
		reset();
		unauthenticate();
	};

	return (
		<React.Fragment>
			<div className="change-password-wrapper">
				{stage === 1 && (
					<Form {...layout} onFinish={handleSubmit(onFinish)} autoComplete="off" noValidate colon={false}>
						<Controller
							name="currentPassword"
							control={control}
							defaultValues=""
							render={({ field }) => (
								<Form.Item
									required
									label="Old password"
									labelAlign="left"
									validateStatus={(errors?.currentPassword?.message || showError) && "error"}
								>
									<Input.Password {...field} />
									{errors?.currentPassword?.message && (
										<Typography.Text type="danger">{errors?.currentPassword?.message}</Typography.Text>
									)}
									{showError && <Typography.Text type="danger">{showError}</Typography.Text>}
								</Form.Item>
							)}
						/>
						<Controller
							name="newPassword"
							control={control}
							defaultValues=""
							render={({ field }) => (
								<Form.Item
									required
									label="New password"
									labelAlign="left"
									validateStatus={(errors?.newPassword?.message || newPasswordError) && "error"}
								>
									<Input.Password {...field} />
									{errors?.newPassword?.message && (
										<Typography.Text type="danger">{errors?.newPassword?.message}</Typography.Text>
									)}
									{newPasswordError && <Typography.Text type="danger">{newPasswordError}</Typography.Text>}
								</Form.Item>
							)}
						/>
						<div className="submit-button" style={{ display: "flex", justifyContent: "flex-end" }}>
							<Form.Item>
								<Button
									style={{ width: 100, marginRight: 30 }}
									disabled={!isValid}
									danger
									type="primary"
									htmlType="submit"
								>
									Save
								</Button>
							</Form.Item>
							<Form.Item>
								<Button style={{ width: 100, marginRight: 30 }} onClick={handleCancel}>
									Cancel
								</Button>
							</Form.Item>
						</div>
					</Form>
				)}
				{stage !== 1 && (
					<React.Fragment>
						<div className="stage2-wrapper" style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
							<Typography.Text>Your password has been changed successfully!</Typography.Text>
						</div>
						<div className="submit-button">
							<Button style={{ width: 100, marginLeft: "70%" }} onClick={handleClose}>
								Close
							</Button>
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default ChangePassword;
