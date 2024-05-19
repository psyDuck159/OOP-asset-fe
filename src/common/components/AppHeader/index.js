import React from "react";
import "./index.css";
import { Breadcrumb, Dropdown, Modal, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useAuth } from "../../../stores/AuthContext";
import Title from "../Title";
import FirstLoginChange from "../../../features/ChangePassword/FirstLoginChange";
import ChangePassword from "../../../features/ChangePassword";
import { capitalize } from "lodash";
import { useLocation } from "react-router-dom";
import PopUpDialog from "../PopUpDialog";

const AppHeader = () => {
	const [isShowLogoutModal, setIsShowLogoutModal] = React.useState(false);
	const [isShowChangePassword, setIsShowChangePassword] = React.useState(false);
	const location = useLocation();
	const path = location.pathname.split("/");
	const { user, unauthenticate, openChangePassword } = useAuth();

	const handleOpenLogoutPopup = () => {
		setIsShowLogoutModal(true);
	};

	const handleOpenChangePassword = () => {
		setIsShowChangePassword(true);
	};

	const handleCancel = () => {
		setIsShowLogoutModal(false);
		setIsShowChangePassword(false);
	};

	const handleLogout = () => {
		unauthenticate();
	};

	const items = [
		{
			key: "2",
			label: <div onClick={handleOpenChangePassword}>Change Password</div>
		},
		{
			key: "3",
			label: <div onClick={handleOpenLogoutPopup}>Logout</div>
		}
	];

	const breadcrumbItems = [
		!path[1] ? "Home" : "Manage " + capitalize(path[1].slice(0, path[1].length - 1)),
		...path.slice(2).map(item =>
			item
				.split("-")
				.map(item => capitalize(item))
				.join(" ")
		)
	].slice(0, 2);

	return (
		<React.Fragment>
			<div className="header">
				<Breadcrumb separator={">"}>
					{breadcrumbItems.map((item, idx) => {
						return <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>;
					})}
				</Breadcrumb>
				<Dropdown
					menu={{
						items
					}}
				>
					<Space>
						<div>Hello, {user.username}</div>
						<DownOutlined />
					</Space>
				</Dropdown>
			</div>
			<Modal
				title={<Title content={"Are you sure?"} />}
				open={isShowLogoutModal}
				footer={false}
				closable={false}
				centered
				destroyOnClose
			>
				<PopUpDialog
					primaryText={"Log out"}
					defaultText={"Cancel"}
					handlePrimaryClick={handleLogout}
					handleDefaultClick={handleCancel}
					content={"Do you want to log out?"}
				/>
			</Modal>
			<Modal
				title={<Title content={"Change password"} />}
				open={openChangePassword}
				footer={false}
				closable={false}
				centered
				destroyOnClose
			>
				<FirstLoginChange />
			</Modal>
			<Modal
				title={<Title content={"Change password"} />}
				open={isShowChangePassword}
				closable={false}
				onCancel={handleCancel}
				footer={false}
				centered
				destroyOnClose
			>
				<ChangePassword onCancel={handleCancel} />
			</Modal>
		</React.Fragment>
	);
};

export default AppHeader;
