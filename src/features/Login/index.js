import { Card, Image } from "antd";
import React from "react";
import FormLogin from "./components/FormLogin";
import "./index.css";
import Title from "../../common/components/Title";

const Login = () => {
	return (
		<React.Fragment>
			<div className="login-container">
				<Card
					title={<Title content={"Login"} />}
					style={{ width: "40%", bottom: "10%" }}
					extra={<Image src="android-chrome-512x512.png" alt="logo" preview={false} width={70} height={70} />}
				>
					<FormLogin />
				</Card>
			</div>
		</React.Fragment>
	);
};

export default Login;
