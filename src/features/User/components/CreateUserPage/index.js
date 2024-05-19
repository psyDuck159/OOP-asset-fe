import { Button, Card, DatePicker, Form, Input, message, Radio, Select, Space, Typography } from "antd";
import React, { useMemo, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { createUser, getUserDetails, updateUser } from "../../../../services/user.service";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../../constants/paths";
import { CONFIG } from "../../../../constants/config";
import Title from "../../../../common/components/Title";
import { USER_TYPES } from "../../../../constants/states";

const schema = yup
	.object({
		firstName: yup
			.string()
			.required("First name is required")
			.trim("First name is required")
			.matches(
				/^[a-zA-Z ]{1,50}$/,
				"Only spaces and alphabetic characters are used in the first name. " +
					"The length of the first name ranges between one and fifty characters."
			),
		lastName: yup
			.string()
			.required("Last name is required")
			.trim("Last name is required")
			.matches(
				/^[a-zA-Z ]{1,50}$/,
				"Only spaces and alphabetic characters are used in the last name. " +
					"The length of the last name ranges between one and fifty characters."
			),
		dob: yup
			.date()
			.required("Date of birth is required")
			.max(new Date(moment().subtract(18, "years")), "User is under 18. Please select a different date"),
		joinedDate: yup
			.date()
			.required("Joined date is required")
			.test(
				"afterDob",
				"Joined date is not later than Date of Birth. Please select a different date",
				function (value) {
					return value > this.parent.dob;
				}
			)
			.test(
				"notSaturdayOrSunday",
				"Joined date is Saturday or Sunday. Please select a different date",
				function (value) {
					return value?.getDay() !== 6 && value?.getDay() !== 0;
				}
			),
		type: yup.string().required("Type is required"),
		gender: yup.string("Female").required("Gender is required")
	})
	.required();

const DATE_FORMAT = "DD/MM/YYYY";
const CreateUserForm = props => {
	const { username } = useParams();
	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		gender: "",
		type: ""
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues
	} = useForm({
		resolver: yupResolver(schema)
	});

	React.useEffect(() => {
		if (!username) {
			return;
		}
		setLoading(true);
		getUserDetails(username)
			.then(resp => {
				let userData = resp.data.data;
				userData = { ...userData, joinedDate: moment(userData.jointDate), dob: moment(userData.dob) };
				setUser(userData);
				setUserValues(userData);
				setValues(Object.values(getValues()));
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
				message.error("Cannot get user " + username);
			});
	}, []);

	const setUserValues = user => {
		if (user) {
			const inputs = ["firstName", "lastName", "gender", "type", "dob", "joinedDate"];
			inputs.forEach(input => {
				if (user[input]) {
					setValue(input, user[input]);
				}
			});
		}
	};
	const [form] = Form.useForm();

	const onSubmit = async values => {
		if (!username) {
			createNewUser(values);
		} else {
			updateExistedUser(values);
		}
	};

	const createNewUser = async values => {
		try {
			const userData = {
				...values,
				firstName: values?.firstName.trim().replaceAll(/\s+/g, " "),
				lastName: values?.lastName.trim().replaceAll(/\s+/g, " "),
				dob: moment(new Date(values?.dob)).format("YYYY-MM-DD"),
				jointDate: moment(new Date(values?.joinedDate)).format("YYYY-MM-DD")
			};
			setLoading(true);
			const res = await createUser(userData);
			if (res) {
				// userContext.setCrudStatus(true);
				navigate(PATHS.USER);
				setLoading(false);
				message.success("User is created successfully");
				localStorage.setItem(CONFIG.NEW_USER, JSON.stringify(res.data.data));
			}
		} catch (errors) {
			message.error(errors);
		}
	};

	const updateExistedUser = async values => {
		try {
			const userData = {
				...values,
				firstName: values?.firstName.trim().replaceAll(/\s+/g, " "),
				lastName: values?.lastName.trim().replaceAll(/\s+/g, " "),
				dob: moment(new Date(values?.dob)).format("YYYY-MM-DD"),
				jointDate: moment(new Date(values?.joinedDate)).format("YYYY-MM-DD")
			};
			const res = await updateUser(username, userData);
			if (res) {
				navigate(PATHS.USER);
				message.success("User is updated successfully");
				localStorage.setItem(CONFIG.NEW_USER, JSON.stringify(res.data.data));
			}
		} catch (errors) {
			message.error(errors);
		}
	};

	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
	};

	const disabledFutureDate = current => {
		return current > moment().endOf("day");
	};

	const [values, setValues] = useState(Object.values(getValues()));
	const isAllFilled = useMemo(
		() => values.length !== 0 && values.every(value => value && JSON.stringify(value).replaceAll(/["\s+]/g, "")),
		[values]
	);

	const isChanged = useMemo(
		() =>
			user.dob?.diff(getValues("dob")) !== 0 ||
			user.gender !== getValues("gender") ||
			user.joinedDate?.diff(getValues("joinedDate")) !== 0 ||
			user.type !== getValues("type"),
		[user, getValues()]
	);

	const onDobDateChange = date => {
		setValue("dob", date);
		setValues([date, ...Object.values(getValues())]);
	};

	const onJoinedDateChange = date => {
		setValue("joinedDate", date);
		setValues([date, ...Object.values(getValues())]);
	};
	const onTypeChange = option => {
		setValue("type", option);
		setValues([option, ...Object.values(getValues())]);
	};
	const onInputChange = e => {
		setValue(e.target.name, e.target.value);
		setValues([e.target.value, ...Object.values(getValues())]);
	};
	return (
		<React.Fragment>
			<div
				className="create-user-container"
				style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
			>
				<Card
					title={<Title content={!username ? "Create New User" : "Edit User"} />}
					style={{
						minWidth: 700,
						width: "50%"
					}}
					headStyle={{
						color: "red"
					}}
				>
					<Form
						form={form}
						colon={false}
						noValidate
						labelAlign="left"
						labelCol={{
							span: 4,
							offset: 1
						}}
						wrapperCol={{
							span: 16,
							offset: 1
						}}
						onFinish={handleSubmit(onSubmit)}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
					>
						<Controller
							name="firstName"
							defaultValue=""
							control={control}
							render={({ field }) => (
								<Form.Item label="First Name" required validateStatus={errors?.firstName?.message && "error"}>
									<Input {...field} onChange={onInputChange} disabled={!!username} />
									{errors?.firstName?.message && (
										<Typography.Text type="danger">{errors?.firstName?.message}</Typography.Text>
									)}
								</Form.Item>
							)}
						/>

						<Controller
							name="lastName"
							defaultValue=""
							control={control}
							render={({ field }) => (
								<Form.Item required label="Last Name" validateStatus={errors?.lastName?.message && "error"}>
									<Input {...field} onChange={onInputChange} disabled={!!username} />
									{errors?.lastName?.message && (
										<Typography.Text type="danger">{errors?.lastName?.message}</Typography.Text>
									)}
								</Form.Item>
							)}
						/>

						<Controller
							name="dob"
							control={control}
							render={({ field }) => (
								<Form.Item required label="Date of Birth" validateStatus={errors?.dob?.message && "error"}>
									<DatePicker
										{...field}
										defaultPickerValue={moment().subtract(18, "years").startOf("day")}
										placeholder={DATE_FORMAT}
										style={{ width: "100%" }}
										disabledDate={disabledFutureDate}
										format={DATE_FORMAT}
										onChange={onDobDateChange}
									/>
									{errors?.dob?.message && <Typography.Text type="danger">{errors?.dob?.message}</Typography.Text>}
								</Form.Item>
							)}
						/>

						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<Form.Item required label="Gender" validateStatus={errors?.gender?.message && "error"}>
									<Radio.Group {...field} onChange={onInputChange}>
										<Radio value="Female">Female</Radio>
										<Radio value="Male"> Male </Radio>
									</Radio.Group>
									<br />
									{errors?.gender?.message && (
										<Typography.Text type="danger">{errors?.gender?.message}</Typography.Text>
									)}
								</Form.Item>
							)}
						/>

						<Controller
							name="joinedDate"
							control={control}
							render={({ field }) => (
								<Form.Item required label="Joined Date" validateStatus={errors?.joinedDate?.message && "error"}>
									<DatePicker
										{...field}
										placeholder={DATE_FORMAT}
										style={{ width: "100%" }}
										disabledDate={disabledFutureDate}
										format={DATE_FORMAT}
										onChange={onJoinedDateChange}
									/>
									{errors?.joinedDate?.message && (
										<Typography.Text type="danger">{errors?.joinedDate?.message}</Typography.Text>
									)}
								</Form.Item>
							)}
						/>

						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Form.Item required label="Type" validateStatus={errors?.type?.message && "error"}>
									<Select
										{...field}
										onChange={onTypeChange}
										options={[
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
									{errors?.type?.message && <Typography.Text type="danger">{errors?.type?.message}</Typography.Text>}
								</Form.Item>
							)}
						/>

						<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<Form.Item shouldUpdate>
								<Space>
									<Button
										type="primary"
										htmlType="submit"
										style={{ width: "100px" }}
										disabled={!isAllFilled}
										danger
										loading={loading}
									>
										Save
									</Button>
									<Button htmlType="button" style={{ width: "100px" }} onClick={e => navigate(PATHS.USER)}>
										Cancel
									</Button>
								</Space>
							</Form.Item>
						</div>
					</Form>
				</Card>
			</div>
		</React.Fragment>
	);
};
export default CreateUserForm;
