export const authFieldsErrors = {
	email: [
		{ type: 'required', message: 'Enter email address' },
		{ type: 'pattern', message: 'Please enter a valid email address' },
	],
	firstName: [
		{ type: 'required', message: 'Enter first name' },
		{ type: 'maxlength', message: 'Max 25 character are allowed' },
	],
	lastName: [
		{ type: 'required', message: 'Enter last name' },
		{ type: 'maxlength', message: 'Max 25 character are allowed' },
	],
	tempOtp: [{ type: 'required', message: 'Enter OTP' }],
	countryName: [{ type: 'required', message: 'Select country' }],
	state: [{ type: 'required', message: 'Select state' }],
	city: [{ type: 'required', message: 'Select city' }],
	mobileNumber: [{ type: 'required', message: 'Enter mobile number' }],
	organizationId: [{ type: 'required', message: 'Select business' }],
	type: [{ type: 'required', message: 'Select business type' }],
	industry: [{ type: 'required', message: 'Select industry' }],
	registeredName: [{ type: 'required', message: 'Enter business name' }],
	
	panNumber: [
		{ type: 'required', message: 'Enter PAN number' },
		{ type: 'pattern', message: 'Please enter a valid PAN number' },
	],
	gstNumber: [
		{ type: 'required', message: 'Enter GST number' },
		{ type: 'pattern', message: 'Please enter a valid GST number' },
	],
};


export const taskFieldForm = {
	name: [{ type: 'required', message: 'Enter task name' }],
	taskStatus: [{ type: 'required', message: 'Enter status' }],
	description: [{ type: 'required', message: 'Enter task description' }],
};


