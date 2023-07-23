export const Config = {
  offset: [25.0, 25.0],
  url: "https://www.google.com/",

  view: (width = innerWidth, height = innerHeight) => ({
    height: height * 0.8 | 0,
    width: width * 0.8 | 0,
    y: height * 0.1 | 0,
    x: width * 0.1 | 0
  })
};

export const features = () => {
  const { width, height, x, y } = Config.view();

  return `
    width=${width},height=${height},
    top=${x + screenX},left=${y + screenY},
    nodeIntegration=no,noreferrer,popup
  `.replace(/\r?\n|\r|\s+/g, "");
};
