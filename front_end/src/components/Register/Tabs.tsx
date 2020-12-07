import React from 'react';
import {withStyles, Theme, createStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DoctorRegister from './DoctorRegister';
import InstitutionRegister from './InstitutionRegister';

interface StyledTabsProps {
	value: number;
	onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles(theme => ({
	root: {
		marginTop: '20px',
	},
	indicator: {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		'& > span': {
			maxWidth: 50,
			width: '100%',
			backgroundColor: theme.palette.secondary.main,
		},
	},
}))((props: StyledTabsProps) => (
	<Tabs {...props} TabIndicatorProps={{children: <span />}} centered />
));

interface StyledTabProps {
	label: string;
}

const StyledTab = withStyles((theme: Theme) =>
	createStyles({
		root: {
			textTransform: 'none',
			fontWeight: theme.typography.fontWeightRegular,
			fontSize: theme.typography.pxToRem(15),
			marginRight: theme.spacing(1),
			'&:focus': {
				opacity: 1,
			},
		},
	})
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default function CustomizedTabs({useStyles}) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div style={{paddingBottom: '20px'}}>
			<StyledTabs
				value={value}
				onChange={handleChange}
				aria-label="styled tabs example"
			>
				<StyledTab label="Doctor" />
				<StyledTab label="Institution" />
			</StyledTabs>
			<TabPanel value={value} index={0}>
				<DoctorRegister useStyles={useStyles} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<InstitutionRegister useStyles={useStyles} />
			</TabPanel>
		</div>
	);
}
