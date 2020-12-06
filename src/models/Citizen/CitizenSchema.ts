import ICitizen from '@models/Citizen/ICitizen';
import ICitizenDoc from '@models/Citizen/ICitizenDoc';
import {model, Schema} from 'mongoose';

const citizenSchemaFields: Record<keyof ICitizen, any> = {
	device: {type: String},
	notifToken: {type: String, required: true},
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
