import { getVideos } from "./getVideos";

const runGetVideos = async () => {
  try {
    await getVideos();
  } catch (error) {
    console.error("Error in getVideos:", error);
  }

  // Llamar a la función nuevamente después de que se complete
  setTimeout(runGetVideos, 0); // Puedes ajustar el retraso si es necesario
};

runGetVideos();
