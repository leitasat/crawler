import Parser from './parser';
import { expect } from 'chai';

describe('Parser', function() {
  let parser: Parser;

  it('trivial', () => {
    let parser = new Parser('http://google.com');
    expect(parser.prepareUrl('/about')).to.equal('http://google.com/about');
  });

  it('no extra slashes', () => {
    let parser = new Parser('http://google.com/');
    expect(parser.prepareUrl('/about')).to.equal('http://google.com/about');
  });

  it('relative path without slash', () => {
    let parser = new Parser('http://google.com/about');
    expect(parser.prepareUrl('us')).to.equal('http://google.com/about/us');
  });

  it('relative path', () => {
    let parser = new Parser('http://google.com/about/');
    expect(parser.prepareUrl('us')).to.equal('http://google.com/about/us');
  });

});
