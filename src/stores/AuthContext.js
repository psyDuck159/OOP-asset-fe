import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/paths";

const AuthContext = React.createContext({
	user: {},
	authenticate: () => {},
	unauthenticate: () => {},
	openChangePassword: false,
	setShowChangePassword: () => {}
});

export const AuthProvider = props => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
	const [openChangePassword, setOpenChangePassword] = useState(user ? user.lastLogin === null : false);
	const navigate = useNavigate();

	const authenticate = async data => {
		setUser(data);
		window.location.href = PATHS.HOME;
	};

	const unauthenticate = async () => {
		localStorage.clear();
		setUser(null);
		navigate("/login", { replace: true });
	};

	const setShowChangePassword = () => {
		setOpenChangePassword(false);
	};

	return (
		<AuthContext.Provider value={{ user, authenticate, unauthenticate, openChangePassword, setShowChangePassword }}>
			{React.Children.toArray(props.children)}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
