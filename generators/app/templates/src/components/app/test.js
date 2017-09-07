const { h } = require('preact');
const { shallow } = require('preact-render-spy');
const Component = require('.');

describe('app', () => {
  it('renders "Hello World!"', () => {
    const context = shallow(h(Component));
    assert.equal(context.text(), 'Hello World!');
  });
});
