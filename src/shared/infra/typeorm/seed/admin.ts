import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import connectDB from "../index";

async function create() {
  const id = uuidV4();
  const password = await hash("admin", 8);

  await connectDB.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXXXXXX' )`,
  );

  await connectDB.destroy();
}

create().then(() => console.log("User admin created!"));
