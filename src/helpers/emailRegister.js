import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, lastname, token } = data;

  const info = await transport.sendMail({
    from: "Tu Criadero",
    to: email,
    subject: "Confirmación de cuenta",
    text: "Confirme su cuenta",
    html: `<h2>Hola ${name} ${lastname} </h2>
        <p>Tu cuenta ya está lista para empezar a utilizar "Tu Criadero", solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirmar Cuenta</a>
        </p>

        <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>`,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegister;
