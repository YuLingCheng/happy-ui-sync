import { makeApiCall } from "./fetch";

const getOldColors = async (repository, colorsFilepath, branchRef, token) => {
  let encodedColorsFile;
  try {
    encodedColorsFile = await makeApiCall(
      `contents/${colorsFilepath}?ref=${branchRef}`,
      repository,
      { token }
    );
  } catch (error) {
    console.error("Could not get the existing colors from Github", {
      path: `contents/${colorsFilepath}?ref=${branchRef}`,
      repository,
    });
    throw Error(
      `Could not get the existing colors from Github. ${error.message}`
    );
  }
  try {
    const decodedColorsFile = window.atob(encodedColorsFile.content);
    const oldColors = JSON.parse(decodedColorsFile);
    return { oldColors, encodedColorsFile };
  } catch (error) {
    console.error(
      `Could not read the existing colors from the file "${colorsFilepath}`,
      {
        encodedColorsFile,
      }
    );
    throw Error(
      `Could not read the existing colors from the file "${colorsFilepath}". It should be a valid JSON file.`
    );
  }
};

export default getOldColors;
