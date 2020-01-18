/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import { IncomingHttpHeaders } from 'http';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import SHA1 from 'crypto-js/sha1';

interface ICosAuthOpt {
  SecretId: string;
  SecretKey: string;
  Method: 'get' | 'put' | 'post';
  Pathname: string;
  Headers: IncomingHttpHeaders;
}

function camSafeUrlEncode(str: string) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

/* eslint-disable  */
var getObjectKeys = function(obj) {
  var list = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  return list.sort(function(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b ? 0 : a > b ? 1 : -1;
  });
};

var obj2str = function(obj) {
  var i, key, val;
  var list = [];
  var keyList = getObjectKeys(obj);
  for (i = 0; i < keyList.length; i++) {
    key = keyList[i];
    val = obj[key] === undefined || obj[key] === null ? '' : '' + obj[key];
    key = key.toLowerCase();
    key = camSafeUrlEncode(key);
    val = camSafeUrlEncode(val) || '';
    list.push(key + '=' + val);
  }
  return list.join('&');
};
/* eslint-enable  */

export const CosAuth = ({
  SecretId,
  SecretKey,
  Method,
  Pathname,
  Headers = {},
}: ICosAuthOpt) => {
  const now = parseInt((new Date().getTime() / 1000).toFixed(), 10) - 1;
  // 默认签名过期时间为当前时间 + 900s(15min)
  const exp = now + 900;
  const qSignTime = `${now};${exp}`;
  const qKeyTime = qSignTime;
  // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
  // 步骤一：计算 SignKey
  const signKey = HmacSHA1(qKeyTime, SecretKey).toString();
  // 步骤二：构成 FormatString
  const formatString = [Method, Pathname, '',  obj2str(Headers), ''].join('\n');

  // 步骤三：计算 StringToSign
  const stringToSign = [
    'sha1',
    qSignTime,
    SHA1(formatString).toString(),
    '',
  ].join('\n');

  // 步骤四：计算 Signature
  const qSignature = HmacSHA1(stringToSign, signKey).toString();
  const authorization = [
    'q-sign-algorithm=sha1',
    `q-ak=${SecretId}`,
    `q-sign-time=${qSignTime}`,
    `q-key-time=${qKeyTime}`,
    `q-header-list=${getObjectKeys(Headers)
      .join(';')
      .toLowerCase()}`,
    `q-url-param-list=`,
    `q-signature=${qSignature}`,
  ].join('&');

  return authorization;
};
