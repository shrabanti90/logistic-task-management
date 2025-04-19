exports.createOrUpdate = {
  name: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Task Name cannot be empty',
    isString: {
      errorMessage: 'Name must be string',
    },
  },
  description: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'Task Desription cannot be empty',
    isString: {
      errorMessage: 'Description  be string',
    },
  },
  taskStatus: {
    in: ['body'],
    trim: true,
    notEmpty: true,
    errorMessage: 'status cannot be empty',
    isString: {
      errorMessage: 'Status must be string',
    },
  },
};


