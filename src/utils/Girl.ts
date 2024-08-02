import { girls } from "/models/girls";
import db from "../config/db";
class Girl {
  private db: DbType;
  constructor() {
    this.db = db;
  }
  async get(): Promise<GirlType> {
    const girlsList: GirlType[] = await this.db.select().from(girls);
    return girlsList[Math.floor(Math.random() * girlsList.length)];
  }
}

export default Girl;
