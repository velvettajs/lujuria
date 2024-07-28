import { girls } from 'src/models/girls';
import db from '/database/dbClient';
class Girl {
  private db;
  constructor() {
    this.db = db;
  }
  async get(): Promise<GirlType> {
    const girlsList: GirlType[] = await this.db.select().from(girls);
    const randomIndex = Math.floor(Math.random() * girlsList.length);
    return girls[randomIndex];
  };

}

export default Girl;