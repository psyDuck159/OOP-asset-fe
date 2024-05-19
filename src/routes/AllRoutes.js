import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../common/layout/Main";
import { COMPONENT_PATHS } from "../constants/componentPath";
import { PATHS } from "../constants/paths";
import { useAuth } from "../stores/AuthContext";

const HomePage = React.lazy(() => import("../features/HomePage"));
const Login = React.lazy(() => import("../features/Login"));
const Assignment = React.lazy(() => import("../features/Assignment"));
const Asset = React.lazy(() => import("../features/Asset"));
const User = React.lazy(() => import("../features/User"));
const ReturnRequest = React.lazy(() => import("../features/ReturnRequest"));
const Forbidden = React.lazy(() => import("../common/components/Forbidden"));
const NotFound = React.lazy(() => import("../common/components/NotFound"));
const CreateUserForm = React.lazy(() => import("../features/User/components/CreateUserPage"));
const CreateAsset = React.lazy(() => import("../features/Asset/components/CreateAsset"));
const CreateAssignment = React.lazy(() => import("../features/Assignment/components/CreateAssignment"));

const loading = () => <div className="loading-state" />;

const LoadComponent = ({ component: Component }) => (
	<Suspense fallback={loading()}>
		<Component />
	</Suspense>
);

const UnProtectedRoute = ({ children }) => {
	const { user } = useAuth();

	if (!!user) {
		return <Navigate to={PATHS.HOME} replace={true} />;
	}

	return children;
};

const ProtectedRoute = ({ children }) => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to={"/login"} />;
	}

	return children;
};

const AdministrativeRoute = ({ children }) => {
	const { user } = useAuth();

	if (user.type !== "Admin") {
		return <Navigate to={PATHS.FORBIDDEN} />;
	}

	return children;
};

const AllRoutes = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<LoadComponent component={HomePage} />} />
				<Route
					path={PATHS.USER}
					element={
						<AdministrativeRoute>
							<LoadComponent component={User} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.ASSIGNMENT}
					element={
						<AdministrativeRoute>
							<LoadComponent component={Assignment} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.ASSET}
					element={
						<AdministrativeRoute>
							<LoadComponent component={Asset} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.RETURN}
					element={
						<AdministrativeRoute>
							<LoadComponent component={ReturnRequest} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.USER + COMPONENT_PATHS.CREATE_USER}
					element={
						<AdministrativeRoute>
							<LoadComponent component={CreateUserForm} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.USER + COMPONENT_PATHS.UPDATE_USER}
					element={
						<AdministrativeRoute>
							<LoadComponent component={CreateUserForm} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.ASSIGNMENT + COMPONENT_PATHS.CREATE_ASSIGNMENT}
					element={
						<AdministrativeRoute>
							<LoadComponent component={CreateAssignment} />
						</AdministrativeRoute>
					}
				/>
				<Route
					path={PATHS.ASSET + COMPONENT_PATHS.CREATE_ASSET}
					element={
						<AdministrativeRoute>
							<LoadComponent component={CreateAsset} />
						</AdministrativeRoute>
					}
				/>
			</Route>
			<Route
				path="/login"
				element={
					<UnProtectedRoute>
						<LoadComponent component={Login} />
					</UnProtectedRoute>
				}
			/>
			<Route path={PATHS.FORBIDDEN} element={<LoadComponent component={Forbidden} />} />
			<Route path="*" element={<LoadComponent component={NotFound} />} />
		</Routes>
	);
};

export default AllRoutes;
