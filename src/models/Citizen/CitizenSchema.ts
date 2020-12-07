import ICitizen from '@models/Citizen/ICitizen';
import ICitizenDoc from '@models/Citizen/ICitizenDoc';
import INotification from '@models/Notifications/INotification';
import {model, Schema} from 'mongoose';

const notificationSchemaFields: Record<keyof INotification, any> = {
	message: {type: String, required: true},
	date: {type: String, required: true},
};

const notificationSchema: Schema = new Schema(notificationSchemaFields);

const citizenSchemaFields: Record<keyof ICitizen, any> = {
	device: {type: String},
	fcmToken: {type: String},
	notifications: [notificationSchema],
};

const citizenSchema: Schema = new Schema(citizenSchemaFields);

citizenSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default model<ICitizenDoc>('Citizen', citizenSchema);
