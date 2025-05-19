import { apiErrors } from "../../helpers";

export const catch404 = (req, res, next) => next(apiErrors.notFound);

export const catchError = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json(err);
  }

  return res.status(500).json({
    ...apiErrors.serverError,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
