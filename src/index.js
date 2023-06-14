import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import usersRoute from "./routes/usersRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

app.use(cors());

// const dominiosPermitidos = [process.env.FRONTEND_URL];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (dominiosPermitidos.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("No permitido por CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use("/tucriadero/api/users", usersRoute);

const PORT = process.env.PORT || 3900;

app.listen(PORT, () => {
  console.log(`SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`);
});
