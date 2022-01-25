module.exports = {
  github: {
    release: true,
    releaseName: "Release ${version}",
    assets: ["dist/*.exe", "dist/*.dmg"],
  },
  npm: {
    publish: false,
  },
  git: {
    tag: true,
    commit: true,
    commitMessage: "chore(release): release ${version}",
  },
  hooks: {
    "before:init": ["yarn lint"],
    "after:bump": ["yarn build", "yarn make"],
  },
  plugins: {
    "@release-it/bumper": {
      in: "package.json",
      out: "src/version.json",
    },
    "@release-it/conventional-changelog": {
      infile: "CHANGELOG.md",
      preset: {
        name: "conventionalcommits",
        types: [
          { type: "feat", section: "Features" },
          { type: "fix", section: "Bug Fixes" },
          { type: "chore", section: "Internal" },
          { type: "deps", section: "Dependencies" },
          { type: "tooling", section: "Tooling" },
          { type: "revert", section: "Reverts" },
        ],
      },
    },
  },
};
