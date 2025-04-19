exports.createOrUpdate = {
	"accessManagement.*.type": {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "type cannot be empty",
	},
	"accessManagement.*.view": {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "view cannot be empty",
	},
	"accessManagement.*.add": {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "add cannot be empty",
	},
	"accessManagement.*.edit": {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "edit cannot be empty",
	},
	"accessManagement.*.delete": {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "delete cannot be empty",
	},
	countryCode: {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "Country code cannot be empty",
		isString: {
			errorMessage: "Country code must be string",
		},
	},
	mobileNumber: {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "Mobile number cannot be empty",
		isString: {
		errorMessage: "Mobile number must be string",
		},
	},
	name: {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "Name cannot be empty",
		isString: {
			errorMessage: "Name must be string",
		},
	},
	role: {
		in: ["body"],
		trim: true,
		notEmpty: true,
		errorMessage: "Role cannot be empty",
		isString: {
			errorMessage: "Role must be string",
		},
	}
};
exports.login = {
  countryCode: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Country code cannot be empty",
    isString: {
      errorMessage: "Country code must be string",
    },
  },
  mobileNumber: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Mobile number cannot be empty",
    isString: {
      errorMessage: "Mobile number must be string",
    },
  },
};

exports.changeStatus = {
    status: {
      in: ["query"],
      trim: true,
      notEmpty: true,
      errorMessage: "status cannot be empty",
      isString: {
        errorMessage: "status must be string",
      },
	  isIn: {
		options:[['active','blocked']],
		errorMessage: "Status must be 'active' or 'blocked'",
	  },
    }   
};