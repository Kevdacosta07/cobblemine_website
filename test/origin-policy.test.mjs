import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isAllowedOrigin} from '../src/lib/origin-policy.ts';
const allowed=['https://cobblemine.com','https://cobblemine.fr'];
test('local development accepts the current loopback address and port',()=>{
  for(const host of ['localhost:3000','localhost:3012','127.0.0.1:3001','[::1]:3000'])
    assert.equal(isAllowedOrigin(`http://${host}`,host,allowed,true),true);
});
test('production keeps localhost disabled and checks configured origins',()=>{
  assert.equal(isAllowedOrigin('http://localhost:3000','localhost:3000',allowed,false),false);
  for(const origin of allowed)assert.equal(isAllowedOrigin(origin,new URL(origin).host,allowed,false),true);
});
test('cross-origin requests, lookalike hosts, malformed and missing origins are rejected',()=>{
  for(const dev of [true,false])for(const [origin,host] of [
    ['http://localhost:3001','localhost:3000'],
    ['http://127.0.0.1:3000','localhost:3000'],
    ['https://evil.example','cobblemine.com'],
    ['http://localhost.evil.example:3000','localhost.evil.example:3000'],
    ['http://192.168.1.2:3000','192.168.1.2:3000'],
    ['https://cobblemine.fr','cobblemine.com'],
    ['http://localhost:3000/path','localhost:3000'],
    ['http://user@localhost:3000','localhost:3000'],
    ['null','localhost:3000'],[null,'localhost:3000'],['bad url','localhost:3000'],
  ]) assert.equal(isAllowedOrigin(origin,host,allowed,dev),false,`${origin} -> ${host}`);
});
