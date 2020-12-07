import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

const QRCode = require('qrcode.react');

const Location = ({id, title, description, expanded, handleChange}) => {
	return (
		<Accordion expanded={expanded === id} onChange={handleChange(id)}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
			>
				<Typography className={'location-heading'}>{title}</Typography>
				<Typography className={'location-secondary-heading'}>
					{description}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<QRCode
					size={256}
					value={id}
					style={{marginLeft: 'auto', marginRight: 'auto'}}
					bgColor={'rgba(0, 0, 0, 0)'}
				/>
			</AccordionDetails>
		</Accordion>
	);
};

export default Location;