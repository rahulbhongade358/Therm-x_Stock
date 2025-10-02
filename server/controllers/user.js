import User from "../models/User.js";

const postSignin = async (req, res) => {
  const { name, email, password, role } = req.body;
  if ((!name, !email, !password, !role)) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameValidationRegex = /^[a-zA-Z ]+$/;
  const passwordValidationRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (nameValidationRegex.test(name) === false) {
    return res.json({
      success: false,
      message: "Name Should only contain alphabets",
    });
  }
  if (emailValidationRegex.test(email) === false) {
    return res.json({
      success: false,
      message: "Invalid email format",
    });
  }
  if (passwordValidationRegex.test(password) === false) {
    return res.json({
      success: false,
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return res.json({
      success: false,
      message: `User with email: ${email} has already registered`,
    });
  }
  const newuser = new User({ name, email, password, role });

  const savedUser = await newuser.save();
  res.json({
    success: true,
    user: savedUser,
    message: "User registered Successfully",
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existinguser = await User.findOne({ email, password });
  if (existinguser) {
    res.json({
      success: true,
      user: existinguser,
      message: "login successfull",
    });
  } else {
    res.json({
      success: false,
      message: "Invalid email or password",
      user: null,
    });
  }
};

export { postLogin, postSignin };
