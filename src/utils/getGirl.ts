import girls from "../jsons/girls.json";

export const getGirl = (): { name: string; image: string } => {
  const randomIndex = Math.floor(Math.random() * girls.length);
  return girls[randomIndex];
};
