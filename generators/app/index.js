const Generator = require('yeoman-generator');
const path = require('path');
const { prompt } = require('enquire-simple');

module.exports = class extends Generator {
  async prompt() {
    this.options.appname = path.basename(this.options.env.cwd);
    this.options.authorname = await prompt('Author:', '__authorname__');
  }
  write() {
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationRoot(),
      this.options, {}, {
        globOptions: {
          dot: true,
          ignore: 'node_modules,build,coverage'.split(/,/g).map(_ => `**/*${_}*/**`),
        }
      }
    )
  }
  install() {
    this.installDependencies();
  }
};
