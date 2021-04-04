# Testweave app

Electron app to facilitate the process of mounting the testweave local network to use the [Testweave SDK](https://github.com/ArweaveTeam/testweave-sdk). Heavily relies on [testweave-docker](https://github.com/ArweaveTeam/testweave-docker).

## Usage

### Installation

### Workflow

When you start the app, it will check if docker and docker-compose are installed and, if not, it will install it. **This feature only works on Unix OS for now**. Then, it will check if you already have the local node running. Finally, with the switch presented on the user interface, you can turn the testweave network on and off.

### Remarks

To do all this commands, the app uses mainly two packages: [child_process](https://www.npmjs.com/package/child_process) and [sudo-prompt](https://www.npmjs.com/package/sudo-prompt). They are used to execute the docker and docker-compose commands. Docker needs sudo or administrator permissions to execute so sudo-prompt will ask for your permission every time it runs a command.

## Roadmap

This is very much a WIP. The end goal would be to have something like [Ganache](https://www.trufflesuite.com/ganache) for the Arweave ecosystem. I am working on improvements but it's important to have feedback from the community. Feel free to open issues/PRs or reach out to me on the [Arweave Developer Discord](https://discord.com/invite/BXk8tq7), especifically on the #testweave channel.

## Development

### Project setup
```
npm install
```

### Compiles and hot-reloads for development

Web

```
npm run serve
```

Electron

```
npm run electron:serve
```

### Compiles and minifies for production

Web

```
npm run build
```

Electron

```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
