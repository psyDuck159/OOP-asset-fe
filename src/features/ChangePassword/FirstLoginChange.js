import { Button, Col, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { changePassword } from "../../services/auth.service";
import { useAuth } from "../../stores/AuthContext";

const layout = {
	labelCol: {
		span: 5,
		offset: 1
	},
	wrapperCol: {
		span: 16,
		offset: 1
	}
};

const schema = yup
	.object({
		newPassword: yup.string().required("New password is required")
	})
	.required();

const FirstLoginChange = () => {
	const { setShowChangePassword, unauthenticate } = useAuth();
	const [newPasswordError, setNewPasswordError] = useState("");

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

	useEffect(() => {
		const subscription = watch(data => {
			if (data.newPassword === "") {
				setNewPasswordError("");
			}
			return () => subscription.unsubscribe();
		});
	}, [watch]);

	const onFinish = data => {
		if (!data.newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/g)) {
			setNewPasswordError(
				"Password must contain at least eight characters, including at least one number and includes both lower and uppercase letters and special characters"
			);
			return;
		}

		changePassword({
			currentPassword: "",
			...data
		}).then(() => {
			setShowChangePassword();
			reset();
			unauthenticate();
		});
	};

	return (
		<React.Fragment>
			<div className="change-password-wrapper">
				<Col offset={1} span={16}>
					<p className="dialog1">This is the first time you logged in.</p>
					<p className="dialog2">You have to change your password to continue</p>
				</Col>
				<Form {...layout} onFinish={handleSubmit(onFinish)} autoComplete="off" noValidate colon={false}>
					<Controller
						name="newPassword"
						control={control}
						defaultValues=""
						render={({ field }) => (
							<Form.Item
								required
								label="New password"
								labelAlign="left"
								validateStatus={errors?.newPassword?.message && "error"}
							>
								<Input.Password {...field} />
								{errors?.newPassword?.message && (
									<Typography.Text type="danger">{errors?.newPassword?.message}</Typography.Text>
								)}
								{newPasswordError && <Typography.Text type="danger">{newPasswordError}</Typography.Text>}
							</Form.Item>
						)}
					/>
					<div className="submit-button">
						<Form.Item>
							<Button
								style={{ width: 100, marginLeft: "100%" }}
								disabled={!isValid}
								danger
								type="primary"
								htmlType="submit"
							>
								Save
							</Button>
						</Form.Item>
					</div>
				</Form>
			</div>
		</React.Fragment>
	);
};

export default FirstLoginChange;
