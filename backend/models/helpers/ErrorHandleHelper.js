const { validationResult } = require('express-validator');
const OPTIONS = require('../../config/options');

const { resCode } = OPTIONS;

exports.customErrorLogger = (err) => {
  if (!(err instanceof Error)) {
    err = new Error(err);
  }
  console.error(err);
};

exports.requestValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(resCode.HTTP_BAD_REQUEST)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_BAD_REQUEST,
          errors.array(),
          OPTIONS.errorTypes.INPUT_VALIDATION
        )
      );
  }
  next();
};
