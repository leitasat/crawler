export default class Util {
  public getDomain(url: string): string  {
    let results = url.match(/(\/\/|http\:\/\/|https\:\/\/)?([A-z0-9\.\-_]*)/);
    if (!results) {
      return '';
    }
    if (results[2].indexOf('.') === -1) {
      return '';
    }
    return results[2];
  }

  public isSameDomain(url1: string, url2: string): boolean {
    return this.getDomain(url1) === this.getDomain(url2);
  }

  public getProtocol(url: string): string {
    let results = url.match(/([A-z]*)\:/);
    if (!results) {
      return '';
    }
    return results[1];
  }
}