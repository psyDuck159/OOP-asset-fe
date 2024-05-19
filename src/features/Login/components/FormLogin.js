import { Button, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { login } from "../../../services/auth.service";
import { useAuth } from "../../../stores/AuthContext";

const layout = {
	labelCol: {
		span: 4,
		offset: 1
	},
	wrapperCol: {
		span: 17,
		offset: 1
	}
};

const schema = yup
	.object({
		username: yup.string().required("Username is required"),
		password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters!")
	})
	.required();

export const FormLogin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { authenticate } = useAuth();

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema)
	});

	const onFinish = async data => {
		setIsLoading(true);
		try {
			await login(data).then(res => {
				setIsLoading(false);
				authenticate(res.data?.data?.userDto);
			});
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			message.error("Username or password is incorrect. Please try again");
			reset();
		}
	};

	return (
		<React.Fragment>
			<Form {...layout} colon={false} onFinish={handleSubmit(onFinish)} autoComplete="off" noValidate>
				<Controller
					name="username"
					control={control}
					defaultValues=""
					render={({ field }) => (
						<Form.Item
							required
							label="Username"
							labelAlign="left"
							validateStatus={errors?.username?.message && "error"}
						>
							<Input {...field} placeholder="Input username" />
							{errors?.username?.message && (
								<Typography.Text type="danger">{errors?.username?.message}</Typography.Text>
							)}
						</Form.Item>
					)}
				/>
				<Controller
					name="password"
					control={control}
					defaultValues=""
					render={({ field }) => (
						<Form.Item
							required
							label="Password"
							labelAlign="left"
							validateStatus={errors?.password?.message && "error"}
						>
							<Input {...field} type="password" placeholder="Input password" />
							{errors?.password?.message && (
								<Typography.Text type="danger">{errors?.password?.message}</Typography.Text>
							)}
						</Form.Item>
					)}
				/>
				<div className="submit-button" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<Form.Item>
						<Button
							style={{ width: 100 }}
							disabled={!isValid}
							danger
							type="primary"
							htmlType="submit"
							loading={isLoading}
						>
							Log In
						</Button>
					</Form.Item>
				</div>
			</Form>
		</React.Fragment>
	);
};

export default FormLogin;
