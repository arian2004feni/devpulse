import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  secretExpiresIn: process.env.SECRET_EXPIRES_IN,
  refreshSecretExpiresIn: process.env.REFRESH_SECRET_EXPIRES_IN,
};

export default config;
