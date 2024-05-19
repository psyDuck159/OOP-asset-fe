import { Image, Layout } from "antd";
import React from "react";
import AppHeader from "../../components/AppHeader";
import { Outlet } from "react-router-dom";
import "./index.css";
import Sider from "antd/lib/layout/Sider";
import AppSider from "../../components/AppSider";

const { Header, Content } = Layout;

const MainLayout = () => {
	return (
		<React.Fragment>
			<Layout className="mainLayout">
				<Header>
					<AppHeader />
				</Header>
				<Content>
					<Sider theme="light">
						<Image src="https://i.imgur.com/PJTLxDM.png" alt="logo" width={100} height={100} preview={false} />
						<div className="title">Online Asset Management</div>
						<AppSider />
					</Sider>
					<div className="container">
						<Outlet />
					</div>
				</Content>
			</Layout>
		</React.Fragment>
	);
};

export default MainLayout;
