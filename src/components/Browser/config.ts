export const Config = {
  offset: [25.0, 25.0],
  url: "https://www.google.com/",

  view: (
    height = Math.min(innerHeight, 600),
    width = Math.min(innerWidth, 800)
  ) => ({
    height: height * 0.8 | 0,
    width: width * 0.8 | 0,
    y: height * 0.1 | 0,
    x: width * 0.1 | 0
  })
};

export const features = () => {
  const { width, height, x, y } = Config.view();

  return `
    width=${width - 2.0},
    height=${height - 27.0},
    nodeIntegration=no,popup,
    top=${y + screenTop + 26.0},
    left=${x + screenLeft + 1.0}
  `.replace(/\r?\n|\r|\s+/g, "");
};
