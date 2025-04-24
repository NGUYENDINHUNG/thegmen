import {
  CreateUsersService,
  LoginUserService,
} from "../service/userService.js";

export const CreateUsers = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;
  const data = await CreateUsersService(email, name, password, phoneNumber);
  return res.status(200).json(data);
};
export const LoginUsers = async (req, res) => {
  const { email, password } = req.body;
  const data = await LoginUserService(email, password, res);
  return res.status(200).json(data);
};
