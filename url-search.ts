// URL 查询字符串相关方法

/** 从指定 URL 获取查询字符串 */
export function getSearchFromURL(url: string) {
  const search = [] as string[];

  let state = 0;
  Array.from(url).forEach((char) => {
    if (char === '?') {
      search.push('');
      state = 1;
    } else if (char === '#') {
      state = 0;
    } else {
      if (state === 1) {
        const last = search.length - 1;
        search[last] = search[last] + char;
      }
    }
  });
  state = 0;

  const res = search.filter(s => !!s).join('&');
  return res.length > 0 ? '?' + res : '';
}

/** 查询字符串转参数对象 */
export function searchToParams(search: string): Record<string, string> {
  search = search.replace(/\s/g, '');
  if (search[0] === '?') {
    search = search.slice(1);
  }
  if (!search) {
    return {};
  }
  return search.split('&').reduce((res, kv) => {
    const [key, value] = kv.split('=');
    if (key) {
      res[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    }
    return res;
  }, {});
}

/** 参数对象转查询字符串 */
export function paramsToSearch(params: Record<string, string|number>) {
  const kvs = Object.keys(params).reduce((res, key) => {
    res.push(key + '=' + encodeURIComponent(params[key]).replace(/ /g, '+'));
    return res;
  }, [] as string[]);
  if (kvs.length > 0) {
    return '?' + kvs.join('&');
  }
  return '';
}

/** 从指定 URL 或当前 href 获取指定的查询参数 */
export function getSearchParameter(parameter: string, url?: string) {
  const search = getSearchFromURL(url || window.location.href);
  if (!search) {
    return '';
  }
  if (window.URLSearchParams) {
    const value = new URLSearchParams(search).get(parameter);
    if (value !== null) {
      return value;
    }
  }
  const regex = new RegExp('[?&]' + parameter + '(=([^&#]*)|&|#|$)');
  const match = regex.exec(search);
  if (match && typeof match[2] === 'string') {
    return decodeURIComponent(match[2].replace(/\+/g, ' '));
  }
}
