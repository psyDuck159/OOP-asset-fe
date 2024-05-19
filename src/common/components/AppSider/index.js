import { Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PATHS } from "../../../constants/paths";
import "./index.css";
import { useAuth } from "../../../stores/AuthContext";

const AppSider = () => {
	const url = useLocation();
	let selectedKey = url.pathname.split("/")[1] ? url.pathname.split("/")[1] : "home";
	const { user } = useAuth();

	return (
		<React.Fragment>
			<div className="menu-wrapper">
				<Menu mode="inline" selectedKeys={selectedKey}>
					<Menu.Item key={"home"}>
						<Link to={"/"}>Home</Link>
					</Menu.Item>
					{user && user.type === "Admin" && (
						<>
							<Menu.Item key={PATHS.USER.split("/")[1]}>
								<Link to={PATHS.USER}>Manage User</Link>
							</Menu.Item>
							<Menu.Item key={PATHS.ASSET.split("/")[1]}>
								<Link to={PATHS.ASSET}>Manage Asset</Link>
							</Menu.Item>
							<Menu.Item key={PATHS.ASSIGNMENT.split("/")[1]}>
								<Link to={PATHS.ASSIGNMENT}>Manage Assignment</Link>
							</Menu.Item>
							<Menu.Item key={PATHS.RETURN.split("/")[1]}>
								<Link to={PATHS.RETURN}>Request for Returning</Link>
							</Menu.Item>
						</>
					)}
				</Menu>
			</div>
		</React.Fragment>
	);
};

export default AppSider;
