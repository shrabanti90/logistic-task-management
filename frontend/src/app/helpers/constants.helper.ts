export const OPTIONS = {
	emailPattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
	websitePattern: `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`,
	websiteWithOutHttpPattern: `^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$`,
	panCardPattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`,
	uanCardPattern: `[0-9]{12}`,
	aadharCardPattern: `[2-9]{1}[0-9]{3} [0-9]{4} [0-9]{4}`,
	drivingLicensePattern: '^(?[A-Z]{2})(?d{2})(?d{4})(?d{7})$',
	accountNumberPattern: '[0-9]{9,18}',
	gstInNumberPattern: `\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}`,
	maxLimit: 10,
	documentFileType: 'Please upload proper file format',
	imageType: 'Accepted file in jpeg, png,jpg format',
	sizeLimit: 'Please upload the file that is less then 5mb',
	noRecord: 'No records found',
	defaultNumber: '1111111111',
};


export const SERVICES = {
	USER: 'USER',
	
};
export const confirmMessages = {
	deleteTitle: 'Delete data',
	deleteDescription: 'Are you sure you want delete ',
	hideTitle: 'Request status change',
	hideDescription: 'Are you sure you want to ',
	updateTitle: 'Request update',
	updateDescription: 'Are you sure you want to update ',
	requestTitle: (data: string) => {
		return `Request ${data}`;
	},
	requestDescription: (data: string) => {
		return `Are you sure you want to ${data}`;
	},
};



export const defaultStatus = {
	
	ACTIVE: 'active',
	BLOCKED: 'blocked',
	INACTIVE: 'inactive',
	DELETED: 'deleted',
	
};
export const verificationStatus = {
	DID_NOT_VERIFY: 'did_not_verify',
};






export const Designation = [
	
];

export const ROLES = {
	PROTO_SUPER_ADMIN: 'PROTO_SUPER_ADMIN',
	

	getAllRolesAsArray: () => {
		return Object.keys(ROLES);
	},
	
	getWebArray: (): Array<string> => {
		return [
		
			ROLES.PROTO_SUPER_ADMIN,
			
		];
	},
	getAdminArray: (): Array<string> => {
		return [
			ROLES.PROTO_SUPER_ADMIN,
			
		];
	},
	getAdminList: () => [
		{ label: 'Super admin', value: ROLES.PROTO_SUPER_ADMIN },
		
	],
};

export const adminSideBarItems = [
	{
		name: 'Dashboard',
		icon: 'material-symbols:dashboard-outline',
		path: 'dashboard',
		value: null,
		list: [],
		role: ROLES.getWebArray(),
		accessManagement: [],
	},
	
	{
		name: 'Tasks',
		icon: 'mi:user',
		path: 'tasks',
		value: 'tasks',
		list: [],
		role: ROLES.getAdminArray(),
		accessManagement: [],
	},
];

export const clientSideBarItems = [
	
];
export const addressType = {
	
};
export const employeeAddressType = {
	
};

export const industryType = [
	
];



export const accessManagementTypes = {
	
	TASK_MANAGEMENT: 'task_management',
};


// list to render in verification module
export const verificationList = [
	
];

export enum PermissionType {
	VIEW = 'VIEW',
	ADD = 'ADD',
	EDIT = 'EDIT',
	DELETE = 'DELETE',
}


