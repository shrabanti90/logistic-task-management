exports.create = {
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
  // role: {
	// 	in: ["body"],
	// 	trim: true,
	// 	notEmpty: true,
	// 	errorMessage: "Role cannot be empty",
	// 	isString: {
	// 		errorMessage: "Role must be string",
	// 	},
	// },
};
exports.verifyMobileOtp = {
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
  tempOtp: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Temp OTP cannot be empty",
    isString: {
      errorMessage: "Temp OTP must be string",
    },
  },
};
exports.changeMobileSendOtp = {
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
  }
};
exports.verifyChangeMobileOtp = {
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
  tempOtp: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Temp OTP cannot be empty",
    isString: {
      errorMessage: "Temp OTP must be string",
    },
  },
};
exports.sendEmailOtp = {
  email: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "Email cannot be empty",
    isString: {
      errorMessage: "Email must be string",
    },
          isEmail: {
        bail: true,
      },
  },
};
exports.verifyEmailOtp = {
  email: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "Email cannot be empty",
    isString: {
      errorMessage: "Email must be string",
    },
    isEmail: {
      bail: true,
    },
  },
  tempOtp: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Temp OTP cannot be empty",
    isString: {
      errorMessage: "Temp OTP must be string",
    },
  },
};
exports.sendChangeEmailOtp = {
  email: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "Email cannot be empty",
    isString: {
      errorMessage: "Email must be string",
    },
          isEmail: {
        bail: true,
      },
  },
};
exports.verifyChangeEmailOtp = {
  email: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "Email cannot be empty",
    isString: {
      errorMessage: "Email must be string",
    },
    isEmail: {
      bail: true,
    },
  },
  tempOtp: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Temp OTP cannot be empty",
    isString: {
      errorMessage: "Temp OTP must be string",
    },
  },
};
exports.updateInfo = {
  name: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "first name cannot be empty",
    isString: {
      errorMessage: "First name must be string",
    },
  },
  profilePicture: {
    in: ["body"],
    trim: true,
    notEmpty: {
			if: (value, {req, location, path})=>{
				return req.body.profilePicture ? true : false;
			},
			else: value => {
				return false;
			}
		},    
  }
};

exports.signUp = {
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
};
exports.changeStatus = {
  status: {
    in: ["body"],
    trim: true,
    notEmpty: false,
    errorMessage: "status cannot be empty",
    isString: {
      errorMessage: "status must be string",
    },
    isIn: {
      options:[['pending', 'on_boarded', 'deleted','disapproved','active','blocked']],
      errorMessage: "Status must be 'pending', 'on_boarded' or 'deleted'",
    },
  }   
}
exports.bulkDelete = {
  ids: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'ids cannot be empty',
    isArray: {
      errorMessage: 'ids must be an array',
    },
  },
};
exports.updateFacialImage = {
  facialImage: {
    in: ["body"],
    trim: true,
    notEmpty: true,
    errorMessage: "Facial Image cannot be empty",
    isString: {
      errorMessage: "Facial Image must be string",
    }
  }  
}
exports.userDelete = {
  reasonOfDelete: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Reason of deletion cannot be empty',
    isString: {
      errorMessage: 'Reason of deletion must be string',
    },
  },
};