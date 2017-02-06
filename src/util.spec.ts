import Util from './util';
import { expect } from 'chai';

describe('Util', function() {
  let util: Util;

  beforeEach(() => {
    util = new Util();
  });

  it('trivial positive', () => {
    expect(util.isSameDomain('http://google.com', 'http://google.com/about')).to.equal(true);
  });

  it('trivial negative', () => {
    expect(util.isSameDomain('http://facebook.com', 'http://google.com/about')).to.equal(false);
  });

  it('non-trivial negative', () => {
    expect(util.isSameDomain('https://mail.google.com','https://google.com/')).to.equal(false);
  }); 

  it('with and without protocol positive', () => {
    expect(util.isSameDomain('//google.com', 'http://google.com/about')).to.equal(true);
    expect(util.isSameDomain('google.com', 'http://google.com/about')).to.equal(true);
    expect(util.isSameDomain('google.com', 'google.com/about')).to.equal(true);
    expect(util.isSameDomain('http://google.com', 'google.com/about')).to.equal(true);
  });

  it('with and without protocol negative', () => {
    expect(util.isSameDomain('//facebook.com', 'http://google.com/about')).to.equal(false);
    expect(util.isSameDomain('facebook.com', 'http://google.com/about')).to.equal(false);
    expect(util.isSameDomain('facebook.com', 'google.com/about')).to.equal(false);
  });

  it('trivial subdomain positive', () => {
    expect(util.isSameDomain('http://mail.google.com', 'http://mail.google.com/about')).to.equal(true);
  });

  it('different protocols positive', () => {
    expect(util.isSameDomain('http://mail.google.com', 'https://mail.google.com/about')).to.equal(true);
  });

  it('extracting protocols', () => {
    expect(util.getProtocol('http://mail.google.com')).to.equal('http');
    expect(util.getProtocol('https://mail.google.com')).to.equal('https');
    expect(util.getProtocol('//mail.google.com')).to.equal('');
    expect(util.getProtocol('google.com')).to.equal('');
  });

});