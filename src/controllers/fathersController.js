import { FatherRooster } from "../models/FatherRooster";

export const createFather = async (req, res) => {
  try {
    const father = req.body;

    if (!req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Error no se encontró una imagen" });
    }

    const { secure_url, public_id } = await uploadImage(
      req.files.image.tempFilePath
    );

    await FatherRooster.create(father, secure_url, public_id);

    return res.status(201).json({
      success: true,
      message: "Registro exitoso",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Hubo un error con el registro del gallo",
    });
  }
};
