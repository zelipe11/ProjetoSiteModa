import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/contato.js';
const payload={id:'d61467c6-e663-4a5b-8ae5-cd0d9b904e2c',nome:'Pessoa de teste',mensagem:'Gostaria de conhecer a coleção.',celular:'(11) 99999-9999',email:'contato@example.com'};
function context(body=payload,{origin='https://clama.example',method='POST',fail=false}={}){
 const calls=[];
 return {calls,request:new Request('https://clama.example/api/contato',{method,headers:{origin,'content-type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})}),env:{VOZES_DB:{prepare(sql){return {bind(...values){calls.push({sql,values});return {async run(){if(fail)throw Error('private detail');return {success:true};}};}};}}}};
}
test('armazena celular normalizado e email com SQL parametrizado sem expor dados',async()=>{
 const ctx=context();const result=await onRequest(ctx);
 assert.equal(result.status,201);assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal(ctx.calls[0].values[1],'11999999999');assert.equal(ctx.calls[0].values[2],payload.email);
 assert.equal(ctx.calls[0].values[3],payload.nome);assert.equal(ctx.calls[0].values[4],payload.mensagem);
 assert.match(ctx.calls[0].sql,/ON CONFLICT\(id\) DO NOTHING/);
 assert.ok(!(await result.text()).includes(payload.email));
});
test('recusa dados inválidos e armadilha sem gravar',async()=>{
 for(const changes of [{nome:' '},{nome:'a'.repeat(121)},{mensagem:''},{mensagem:'a'.repeat(2001)},{email:'invalido'},{celular:'123'},{celular:'abc11999999999'},{id:'invalido'},{website:'spam'}]){
  const ctx=context({...payload,...changes});assert.equal((await onRequest(ctx)).status,400);assert.equal(ctx.calls.length,0);
 }
});
test('protege consulta e origem, e não confirma falhas de banco',async()=>{
 for(const [ctx,status] of [[context(payload,{method:'GET'}),405],[context(payload,{origin:'https://outro.example'}),403],[context(payload,{fail:true}),503],[{...context(),env:{}},503]]){
  const response=await onRequest(ctx);assert.equal(response.status,status);assert.ok(!(await response.text()).includes('private detail'));
 }
});
test('limita corpo real de requisição',async()=>{
 const ctx=context({...payload,email:'a'.repeat(9000)});assert.equal((await onRequest(ctx)).status,413);assert.equal(ctx.calls.length,0);
});
