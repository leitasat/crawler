import * as popsicle from 'popsicle';
import Util from './util';
import cheerio = require('cheerio');


interface urlData {
  url: string,
  assets: string[]
}

export default class Parser {
  private util: Util = new Util;
  private baseUrl: string = '';
  private baseDomain: string = '';

  constructor(private url: string) {
    if (url.indexOf('#') > -1) {
      url = url.substr(url.indexOf('#'));
    }
    if (url[url.length - 1] === '/') {
      url = url.substr(0, url.length - 1);
    }
    this.baseUrl = url;
    this.baseDomain = this.util.getProtocol(url) + '://' + this.util.getDomain(url);
  }

  public prepareUrl(targetUrl: string): string {
    if (!targetUrl) {
      return '';
    }
    if (targetUrl === '/') {
      return this.baseDomain;
    }
    if (targetUrl[0] === '/') {
      if (targetUrl[1] == '/') {
        return this.util.getProtocol(this.baseDomain) + ':' + targetUrl;
      } else {
        return this.baseDomain + targetUrl;
      }
    }
    if (this.util.getDomain(targetUrl) === this.util.getDomain(this.baseUrl) && this.util.getProtocol(targetUrl) === '') {
      return this.util.getProtocol(this.baseDomain) + ':' + targetUrl;
    }
    if (this.util.getDomain(targetUrl) === '') {
      return this.baseUrl + '/' + targetUrl;
    }
    return targetUrl;
  }

  public parse(): Promise<any> {
    let assets: string[] = [];
    let links: string[] = [];
    let prepareUrl = (x: string) => this.prepareUrl(x);

    return popsicle.get(this.url)
      .then((res) => {
        let $ = cheerio.load(res.body);
        $('a,script,link,img').each((index: number, element: any) => {
          // clarity was sacrificed by grouping processing of all tags in one to avoid multiple expensive traversals
          switch (element.name) {
            case 'a':
              let url = element.attribs['href'];
              if (url && url != '') {
                if(url.indexOf('#') > -1) {
                  url = url.substr(0,url.indexOf('#') - 1);
                }
                links.push(prepareUrl(url));
              }
              break;

            case 'script':
              let src = element.attribs['src'];
              if (src && src != '') {
                assets.push(src);
              }
              break;

            case 'link':
              if (element.attribs['rel'] && element.attribs['rel'] === 'stylesheet') {
                assets.push(element.attribs['href']);
              }
              break;

            case 'img':
              assets.push(element.attribs['src']);
              break;
            
            default:
              break;
          }
        });
        let data: urlData = {
          'url': this.url,
          'assets': assets.map(prepareUrl)
        };
        return [
          links,
          data
        ];
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }
}