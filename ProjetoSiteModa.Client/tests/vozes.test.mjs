import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/vozes.js';

const id = 'd61467c6-e663-4a5b-8ae5-cd0d9b904e2c';
const payload = {id,texto:'Uma mensagem de resistência.',consentimento:true,website:''};
function request(body = payload, options = {}) {
 return new Request('https://clamamoda.pages.dev/api/vozes', {
  method:'POST',headers:{origin:'https://clamamoda.pages.dev','content-type':'application/json',...options.headers},
  body:JSON.stringify(body),
 });
}
function database({fail=false,success=true}={}) {
 const calls=[];
 return {calls,prepare(sql){return {bind(...values){calls.push({sql,values});return {async run(){if(fail)throw Error('private database detail');return {success};}};}};}};
}
test('grava texto como parâmetro e retorna confirmação sem ecoar conteúdo',async()=>{
 const db=database();const texto="Uma voz: '); DROP TABLE mensagens; --";
 const result=await onRequest({request:request({...payload,texto}),env:{VOZES_DB:db}});
 assert.equal(result.status,201);assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal(db.calls.length,1);assert.ok(!db.calls[0].sql.includes(texto));assert.equal(db.calls[0].values[1],texto);
 assert.ok(!JSON.stringify(await result.json()).includes(texto));
});
test('GET, HEAD e DELETE nunca expõem mensagens',async()=>{
 for(const method of ['GET','HEAD','DELETE']){
  const result=await onRequest({request:new Request('https://clamamoda.pages.dev/api/vozes',{method}),env:{VOZES_DB:database()}});
  assert.equal(result.status,405);assert.equal(result.headers.get('allow'),'POST');
 }
});
test('banco ausente, falha ou resultado inválido nunca confirmam envio',async()=>{
 for(const env of [{},{VOZES_DB:database({fail:true})},{VOZES_DB:database({success:false})}]){
  const result=await onRequest({request:request(),env});assert.equal(result.status,503);
  assert.ok(!(await result.text()).includes('private database detail'));
 }
});
test('rejeita origem externa',async()=>{
 const db=database();const result=await onRequest({request:request(payload,{headers:{origin:'https://outro.example'}}),env:{VOZES_DB:db}});
 assert.equal(result.status,403);assert.equal(db.calls.length,0);
});
test('exige consentimento explícito, mensagem válida e identificador UUID',async()=>{
 for(const invalid of [{...payload,consentimento:false},{...payload,consentimento:'true'},{...payload,texto:'  '},{...payload,texto:'a'.repeat(1001)},{...payload,id:'inválido'},{...payload,website:'https://spam.example'}]){
  const db=database();const result=await onRequest({request:request(invalid),env:{VOZES_DB:db}});
  assert.equal(result.status,400);assert.equal(db.calls.length,0);
 }
});
test('limita tamanho real do corpo mesmo sem content-length',async()=>{
 const result=await onRequest({request:request({...payload,texto:'a'.repeat(9000)}),env:{VOZES_DB:database()}});
 assert.equal(result.status,413);
});
test('rejeita JSON quebrado e formatos inesperados',async()=>{
 const req=new Request('https://clamamoda.pages.dev/api/vozes',{method:'POST',headers:{origin:'https://clamamoda.pages.dev','content-type':'application/json'},body:'{'});
 assert.equal((await onRequest({request:req,env:{}})).status,400);
 for(const body of [null,[],123])assert.equal((await onRequest({request:request(body),env:{}})).status,400);
 assert.equal((await onRequest({request:request(payload,{headers:{'content-type':'text/plain'}}),env:{}})).status,415);
});
test('SQL usa ID único para evitar duplicação em tentativas repetidas',async()=>{
 const db=database();await onRequest({request:request(),env:{VOZES_DB:db}});
 assert.match(db.calls[0].sql,/ON CONFLICT\(id\) DO NOTHING/);assert.equal(db.calls[0].values[0],id);
 assert.ok(!Number.isNaN(Date.parse(db.calls[0].values[2])));
});
