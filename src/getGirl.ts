import girls from "./jsons/girls.json";

export const getGirl = (): { name: string; image: string } => {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * girls.length);

  // Return the item at the random index
  return girls[randomIndex];
};
