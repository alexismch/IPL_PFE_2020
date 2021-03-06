import {Button, CircularProgress, useTheme} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import canvasToImage from 'canvas-to-image';
import React, {useEffect, useState} from 'react';
import ReactToPrint from 'react-to-print';
import {getCurrentDoctorData} from 'services/backend';
import IDoctor from './IDoctor';
import {useHistory} from 'react-router';

const QRCode = require('qrcode.react');
let {REACT_APP_QR_CODE_BASE_URL} = process.env;
if (window.location.origin.includes('prod')) {
	REACT_APP_QR_CODE_BASE_URL = REACT_APP_QR_CODE_BASE_URL?.replace(
		'dev',
		'prod'
	);
}

const QR_LOCATION_BASE_URL = `${REACT_APP_QR_CODE_BASE_URL}/d/`;

const useStyles = makeStyles(theme => ({
	'@global': {
		'.doctor-box': {
			maxWidth: 345,
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: 64,
		},
		'.doctor-qr-code-box': {
			display: 'flex',
		},
		'.doctor-avatar': {
			backgroundColor: theme.palette.primary.main,
		},
		'.doctor-buttons-box': {
			display: 'flex',
			justifyContent: 'flex-end',
		},
		'.doctor-waiting': {
			marginLeft: 'auto',
			marginRight: 'auto',
		},
		'@media print': {
			'.doctor-box': {
				background: 'none',
				border: 'none',
				boxShadow: 'none',
			},
			'.doctor-buttons-box': {
				display: 'none',
			},
			'.doctor-avatar': {
				display: 'none',
			},
		},
	},
}));

const Doctor = () => {
	const theme = useTheme();
	const history = useHistory();
	const [doctor, setDoctor] = useState<IDoctor | null>(null);

	useEffect(() => {
		getCurrentDoctorData(String(localStorage.getItem('Token')))
			.then((response: any) => {
				setDoctor(response.data);
			})
			.catch((error): any => {
				if (error.response.status === 401) {
					history.push('/logout/e');
				}
			});
	}, [history]);

	useStyles();
	let componentRef;
	const value = QR_LOCATION_BASE_URL + doctor?.id;

	const handleSave = () => {
		canvasToImage(`qrcode-${doctor?.id}`, {
			name: `${doctor?.doctor_firstName} ${doctor?.doctor_lastName}`,
			type: 'jpg',
		});
	};

	return (
		<Card className={'doctor-box'} ref={el => (componentRef = el)}>
			<CardHeader
				avatar={
					<Avatar aria-label="recipe" className={'doctor-avatar'}>
						<LocalHospitalOutlinedIcon />
					</Avatar>
				}
				title={`${doctor?.doctor_firstName ?? ''} ${
					doctor?.doctor_lastName ?? ''
				}`}
				subheader={`${doctor?.doctor_inami ?? ''}`}
			/>
			<CardMedia className={'doctor-qr-code-box'}>
				{doctor ? (
					<QRCode
						size={256}
						value={value}
						bgColor={theme.palette.background.paper}
						style={{marginLeft: 'auto', marginRight: 'auto'}}
						includeMargin={true}
						id={`qrcode-${doctor?.id}`}
					/>
				) : (
					<CircularProgress className={'doctor-waiting'} />
				)}
			</CardMedia>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					Give this QR code to be scanned to a patient if he or she
					has contracted the virus.
				</Typography>
			</CardContent>
			{doctor ? (
				<CardActions disableSpacing className={'doctor-buttons-box'}>
					<ReactToPrint
						trigger={() => (
							<Button size="small" color="primary">
								Print
							</Button>
						)}
						content={() => componentRef}
						documentTitle={`${doctor?.doctor_firstName} ${doctor?.doctor_lastName}`}
					/>
					<Button size="small" color="primary" onClick={handleSave}>
						Save
					</Button>
				</CardActions>
			) : (
				''
			)}
		</Card>
	);
};

export default Doctor;
