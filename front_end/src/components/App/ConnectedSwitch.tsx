import DoctorHome from 'components/Homes/DoctorHome/DoctorHome';
import InstitutionHome from 'components/Homes/InstitutionHome/InstitutionHome';
import Logout from 'components/Logout/Logout';
import Navbar from 'components/Navbar/Navbar';
import React from 'react';
import {Helmet} from 'react-helmet';
import {Redirect, Route, Switch} from 'react-router-dom';

const ConnectedSwitch = ({connectedType, setConnectedType}) => {
	return (
		<div>
			<Navbar />
			<Switch>
				<Route path="/home" exact>
					<Helmet>
						<title>Block COVID - Home</title>
					</Helmet>
					{connectedType === 'doctor' ? (
						<DoctorHome />
					) : (
						<InstitutionHome />
					)}
				</Route>
				<Route path="/logout" exact>
					<Logout setConnectedType={setConnectedType} />
				</Route>
				<Route path="/">
					<Redirect to="/home" />
				</Route>
			</Switch>
		</div>
	);
};

export default ConnectedSwitch;