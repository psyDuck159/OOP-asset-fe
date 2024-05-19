import { HashRouter as Router } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import { AuthProvider } from "../stores/AuthContext";

const AppRoute = () => {
	return (
		<Router>
			<AuthProvider>
				<AllRoutes />
			</AuthProvider>
		</Router>
	);
};

export default AppRoute;
