import dotenv from "dotenv";
import { DataSource } from "typeorm";

// Using environment variables
dotenv.config();

const connectDB = new DataSource({
  type: "postgres",
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database:
    process.env.NODE_ENV === "test"
      ? "rentx_test"
      : process.env.TYPEORM_DATABASE,
  migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
  entities: ["./src/modules/**/entities/*.ts"],
});

connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });

export default connectDB;
