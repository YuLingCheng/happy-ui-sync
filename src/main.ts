import getNewColors from "./services/getNewColors";
// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 800, height: 600 });

// get user's info
const getUserInfo = async () => {
  const {
    name,
    email,
    repository,
    colorsFilepath,
    branchRef,
  } = await figma.clientStorage.getAsync("USER_INFO");
  figma.ui.postMessage({
    type: "REHYDRATE_INFO",
    name,
    email,
    repository,
    colorsFilepath,
    branchRef,
  });
};

getUserInfo();

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "SAVE_INFO") {
    const { userName, userEmail, repository, colorsFilepath, branchRef } = msg;
    figma.clientStorage.setAsync("USER_INFO", {
      name: userName,
      email: userEmail,
      repository,
      colorsFilepath,
      branchRef,
    });
    return;
  }
  if (msg.type === "GET_NEW_COLORS") {
    try {
      const newColors = getNewColors(figma);
      figma.ui.postMessage({ type: "NEW_COLORS", newColors });
    } catch (error) {
      console.error(error);
      figma.ui.postMessage({ type: "NEW_COLORS_ERROR", error });
    }
  }
};
