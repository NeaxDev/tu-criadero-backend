import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { uploadImage, deleteImage } from "../services/cloudinary.js";
import { generateJWT } from "../helpers/generateJWT.js";
import emailRegister from "../helpers/emailRegister.js";
import { validateEmail } from "../helpers/validateEmail.js";
import { validatePassword } from "../helpers/validatePassword.js";
import { emailForgotPassword } from "../helpers/emailForgotPassword.js";

export const register = async (req, res) => {
  try {
    const user = req.body;

    const isEmailValid = validateEmail(user.email);

    if (!isEmailValid) {
      return res.status(401).json({
        success: false,
        message: "Error, favor de ingresar un correo electrónico válido",
      });
    }

    const emailExists = await User.findByEmail(user.email);

    if (emailExists) {
      return res.status(401).json({
        success: false,
        message: "El correo electrónico ya está en uso, favor de ingresar otro",
      });
    }

    const passwordValid = validatePassword(user.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Ingrese una contraseña que tenga al menos una letra minúscula, una letra mayúscula, un número y sea de al menos 8 caracteres",
      });
    }

    const phoneExists = await User.findByPhone(user.phone);

    if (phoneExists) {
      return res.status(401).json({
        success: false,
        message: "El número de teléfono ya está en uso, favor de ingresar otro",
      });
    }

    const userSaved = await User.create(user);

    emailRegister(userSaved);

    return res.status(201).json({
      success: true,
      message: "Cheque su cuenta de correo eletrónico y confirme su cuenta",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "Hubo un error con el registro del usuario",
    });
  }
};

export const confirmAccount = async (req, res) => {
  const { token } = req.params;

  const confirmUser = await User.findByToken(token);

  if (!confirmUser) {
    return res.status(404).json({
      success: false,
      message: "Esta cuenta ya está confirmada",
    });
  }

  try {
    await User.confirmToken(confirmUser.id);

    return res.json({
      success: true,
      message: "Cuenta confirmada exitosamente",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    return res.status(401).json({
      success: false,
      message: "Error, favor de ingresar un correo electrónico válido",
    });
  }

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  if (!user.confirmed) {
    return res.status(404).json({
      success: false,
      message: "Esta cuenta no está confirmada",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      token: generateJWT(user.id),
    };

    return res.status(201).json({
      success: true,
      message: "Cuenta autenticada exitosamente",
      data,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Contraseña Incorrecta",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    return res.status(401).json({
      success: false,
      message: "Error, favor de ingresar un correo electrónico válido",
    });
  }

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  if (!user.confirmed) {
    return res.status(401).json({
      success: false,
      message:
        "Cuenta no confirmada, favor de confirmar su cuenta primero y luego vuelva a intentarlo",
    });
  }

  try {
    const userUpdated = await User.forgotPwd(user.id);

    emailForgotPassword({
      email: userUpdated.email,
      name: userUpdated.name,
      lastname: userUpdated.lastname,
      token: userUpdated.token,
    });

    return res.json({
      success: true,
      message:
        "Le hemos enviado un correo con las instrucciones para cambiar su contraseña",
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkToken = async (req, res) => {
  const { token } = req.params;

  const isTokenValid = await User.findByToken(token);

  if (isTokenValid) {
    return res.json({
      success: true,
      message: "Token Válido, ya puede pasar a cambiar su contraseña",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Token No Válido",
    });
  }
};

export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findByToken(token);

  if (!user) {
    return res.status(400).json({
      success: false,
      message:
        "Ocurrió un error, parece ser que no tiene permitido cambiar la contraseña",
    });
  }

  const passwordValid = validatePassword(password);

  if (!passwordValid) {
    return res.status(401).json({
      success: false,
      message:
        "Error, favor de ingresar una contraseña que tenga al menos una letra minúscula, una letra mayúscula, un número y sea de al menos 8 caracteres de longitud.",
    });
  }

  try {
    await User.updatePassword(user.id, password);

    return res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

export const profile = (req, res) => {
  const { user } = req;

  res.json({
    success: true,
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Ocurrió un error al momento de intentar actualizar perfil",
    });
  }

  const { email, name, lastname, phone } = req.body;

  if (user.email !== email) {
    const existsEmail = await User.findByEmail(email);

    if (existsEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Ese email ya está en uso" });
    }
  }

  if (!req.files.image) {
    return res
      .status(400)
      .json({ success: false, message: "Error no se encontró una imagen" });
  }

  const { secure_url, public_id } = await uploadImage(
    req.files.image.tempFilePath
  );

  try {
    const userUpdated = await User.updateUserProfile(id, {
      email,
      name,
      lastname,
      phone,
      secure_url,
      public_id,
    });

    console.log(userUpdated);

    return res.status(201).json({
      success: true,
      message: "Los datos del usuario se han actualizado correctamente",
      data: userUpdated,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfileWithoutImage = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      success: true,
      message: "Ocurrió un error al momento de intentar actualizar perfil",
    });
  }

  const { email, name, lastname, phone } = req.body;

  if (user.email !== email) {
    const existsEmail = await User.findByEmail(email);

    if (existsEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Ese email ya está en uso" });
    }
  }

  try {
    const userUpdated = await User.updateProfileWithoutImage(id, {
      email,
      name,
      lastname,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Los datos del usuario se han actualizado correctamente",
      data: userUpdated,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  const { id } = req.user;
  const { current_pwd, new_pdw } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Ocurrió un error al momento de actualizar la contraseña",
    });
  }

  const isPasswordValid = await bcrypt.compare(current_pwd, user.password);

  if (isPasswordValid) {
    const passwordValid = validatePassword(new_pdw);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Error, favor de ingresar una contraseña que tenga al menos una letra minúscula, una letra mayúscula, un número y sea de al menos 8 caracteres de longitud.",
      });
    }

    try {
      await User.updatePasswordProfile(user.id, new_pdw);

      return res.json({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Contraseña Actual es Incorrecta",
    });
  }
};
