import Util from './util';

export default class Crawler {
  private urlQueue: string[] = [];
  private currentUrlIndex: number = 0;
  private entryDomain: string;
  private util: Util = new Util;

  private isValidUrl(url: string) {
    return this.util.isSameDomain(this.entryUrl, url) && this.urlQueue.indexOf(url) === -1;
  }

  constructor(private entryUrl: string) {
    if (entryUrl.substr(0,4) !== 'http') {
      entryUrl = 'http://' + entryUrl;
    }
    this.entryDomain = this.util.getDomain(entryUrl);
    this.enqueueUrl(entryUrl);
  }

  public enqueueUrl(url: string): boolean {
    if (url.length === 0 || url.substr(0,4) !== 'http' || url.indexOf('#') > -1) {
      return false;
    }
    if (this.isValidUrl(url)) {
      this.urlQueue.push(url);
      return true;
    }
    return false;
  }

  public dequeueUrl(): string | boolean {
    if (this.currentUrlIndex >= this.urlQueue.length) {
      return false;
    }
    let url = this.urlQueue[this.currentUrlIndex];
    this.currentUrlIndex++;
    return url;
  }
}
