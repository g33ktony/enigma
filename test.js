const fs=require('fs');require('vm').runInThisContext(fs.readFileSync(process.argv[2],'utf8').match(/\/\*ENGINE\*\/([\s\S]*?)\/\*\/ENGINE\*\//)[1]);
const assert=require('assert');
for(const k in REFLA){const r=REFLA[k];assert.equal(new Set(r).size,26,k);r.forEach((o,i)=>{assert.equal(r[o],i,k);assert.notEqual(o,i,k)})}
for(const k in ROTORS)assert.equal(new Set(ROTORS[k].fw).size,26,k);
const plugsOf=s=>{const p=[...Array(26).keys()];(s||'').split(' ').filter(Boolean).forEach(x=>{p[idx(x[0])]=idx(x[1]);p[idx(x[1])]=idx(x[0])});return p};
const run=(refl,rs,rings,pos,pl,txt)=>{const st={refl,plugs:plugsOf(pl),slots:rs.map((r,i)=>({r,ring:rings[i],pos:idx(pos[i])}))};return [...txt].map(ch=>A[encipher(st,idx(ch)).out]).join('')};
assert.equal(run('B',['I','II','III'],[0,0,0],'AAA','','AAAAA'),'BDZGO');
assert.equal(run('B fino',['Beta','I','II','III'],[0,0,0,0],'AAAA','','AAAAA'),'BDZGO');
const ct='EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK';
const pt=run('B',['II','IV','V'],[1,20,11],'BLA','AV BS CG DL FU HZ IN KM OW RX',ct);console.log(pt);
assert(pt.startsWith('AUFKLXABTEILUNG'));
// double step: ADU -> ADV -> AEW -> BFX with I II III
const st={refl:'B',plugs:plugsOf(),slots:['I','II','III'].map((r,i)=>({r,ring:0,pos:idx('ADU'[i])}))};
const seen=[];for(let i=0;i<3;i++){encipher(st,0);seen.push(st.slots.map(s=>A[s.pos]).join(''))}
assert.deepEqual(seen,['ADV','AEW','BFX']);
const h=run('B',['I','II','III'],[0,0,0],'AAA','','HOLAXMUNDO');console.log('HOLA',h,run('B',['I','II','III'],[0,0,0],'AAA','',h));
console.log('ok');
// Text preparation: Ñ → NY, spaces → X except in 5-letter groups.
const page=fs.readFileSync(process.argv[2],'utf8');
require('vm').runInThisContext(page.match(/const isGrouped[\s\S]*?\n}/)[0]+';globalThis.clean=clean');
assert.deepEqual(clean('El año pasado',true,true),{t:'ELXANYOXPASADO',grouped:false});
assert.deepEqual(clean('Año',true,false),{t:'ANO',grouped:false});
assert.deepEqual(clean('Mañana ÁÉ',false,true),{t:'MANYANAAE',grouped:false});
assert.deepEqual(clean('ATAQU EXALX NORTE',true,true),{t:'ATAQUEXALXNORTE',grouped:true});
console.log('clean ok');
