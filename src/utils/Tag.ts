import db from "../config/db.js";
import { tags } from "/models/tags";
class Tag {
  public async get(): Promise<TagType> {
    const result: TagType[] = await db.select().from(tags);
    if (result.length <= 0) throw new Error("Error finding webhook's tag");
    const randomIndex = Math.floor(Math.random() * result.length);
    const random: TagType = result[randomIndex];
    return random;
  }
}

export default Tag;
