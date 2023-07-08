# [BrowserOS](https://ustymukhman.github.io/BrowserOS/dist) #

> Electron app turned into OS

![](https://img.shields.io/github/package-json/dependency-version/UstymUkhman/BrowserOS/dev/typescript?style=flat-square)
![](https://img.shields.io/github/package-json/dependency-version/UstymUkhman/BrowserOS/solid-js?style=flat-square)
![](https://img.shields.io/github/package-json/dependency-version/UstymUkhman/BrowserOS/dev/vite?style=flat-square)

![](https://img.shields.io/github/deployments/UstymUkhman/BrowserOS/github-pages?style=flat-square)
![](https://img.shields.io/github/repo-size/UstymUkhman/BrowserOS?color=yellowgreen&style=flat-square)
![](https://img.shields.io/github/package-json/v/UstymUkhman/BrowserOS?color=orange&style=flat-square)
![](https://img.shields.io/github/license/UstymUkhman/BrowserOS?color=lightgrey&style=flat-square)

![](./public/assets/images/preview/light.png)
![](./public/assets/images/preview/dark.png)

[![]](https://github.com/UstymUkhman/BrowserOS/assets/9247261/cc92e304-9ff2-4d80-9d60-739566c7f34c)

## Download ##

```
git clone https://github.com/UstymUkhman/BrowserOS.git
cd BrowserOS/

pnpm i   # Install project dependencies
npx reqs # Download Linux filesystem
```

## Develop ##

```
pnpm start:web # As a web application
pnpm start:app # As an electron application
```

## Lint ##

```
pnpm lint:js  # Run eslint for TS and JS
pnpm lint:css # Run stylelint for CSS
```

## Build ##

```
pnpm build:web  # As a web application
pnpm build:app  # As an electron application
pnpm build:test # As an unpacked application
pnpm build:prod # As a production application
```

## Run ##

### Qemu (Linux): ###

```
pnpm build:app  # Build as an electron application
pnpm build:prod # Package it to be production-ready

npx linuxjs     # Create an ISO image and launch qemu to run it:
qemu-system-x86_64 -boot d -cdrom filesystem/BrowserOS.iso -m 4096
```
