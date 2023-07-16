export const Browser = {
  url: "https://www.google.com/",

  view: {
    x: 200,
    y: 150,
    width: 400,
    height: 300
  }
};

export const browserFeatures = () => `
  width=${Browser.view.width},
  height=${Browser.view.height},
  top=${Browser.view.x + screenX},
  left=${Browser.view.y + screenY},
  nodeIntegration=no,noreferrer,popup
`.replace(/\r?\n|\r|\s+/g, "");
