const { validationResult } = require("express-validator")

const HttpError = require("../models/http-error");
const User = require("../models/user")

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Jimmy",
    email: "jimmy@test.com",
    password: "0000"
  }
]

const getUsers = async(req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password")
  } catch(err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500)
    return next(error)
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const signup = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422)
  }
  const { name, email, password } = req.body

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      "註冊失敗，請稍後再試。", 500
    )
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError("該email已被註冊，請使用其他email。", 422)
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password,
    images: []
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError(
      "註冊失敗，請稍後再試。"
    )
    return next(error)
  }


  res.status(201).json({user: createdUser.toObject({ getters: true })})
}

const login = async(req, res, next) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch(err) {
    const error = new HttpError("登入失敗，請稍後再試。", 500)
    return next(error)
  }

  if (!existingUser) {
    const error = new HttpError("請先註冊。", 401)
    return next(error)
  }
  if (existingUser.password !== password) {
    const error = new HttpError("密碼錯誤。", 401)
    return next(error)
  }

  res.json({ message: "Logged in!" })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login 