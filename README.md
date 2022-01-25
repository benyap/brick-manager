![Brick Manager Logo](https://user-images.githubusercontent.com/19235373/150919970-8361832e-5e56-4f7f-936f-904a73760505.png)

# Brick Manager

![license](https://img.shields.io/github/license/benyap/brick-manager?style=flat-square)
![release](https://img.shields.io/github/v/release/benyap/brick-manager?display_name=tag&style=flat-square)

**Brick Manager** is a desktop application for keep track of your LEGO bricks. The
application is free to use and saves your data locally.

## Features

- Track the LEGO parts you own in your inventory
- Browse through LEGO part data, sourced from Rebrickable, BrickLink and LEGO
- WIP: Organise different collections of LEGO parts to help plan for your next MOC
  (My Own Creation)
- WIP: Import and export part lists for easy buying on BrickLink

## Download and install

Head over to the [Releases](https://github.com/benyap/brick-manager/releases) page to
download the the application. Currently supported on Windows and macOS.

## Development

This is an Electron application built with Typescript. To develop locally, clone this
repository and install dependencies:

```sh
yarn install
```

To start the application in development mode, run:

```sh
yarn dev
```

To build the application, run:

```sh
yarn build && yarn make
```

## License

This project is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
This means you are allowed to use, modify and share this software, but you may not
distribute any closed source versions of this software, even if it is modified. All
versions of this software must remain open source and accessible. See
[License](LICENSE) for more information.
