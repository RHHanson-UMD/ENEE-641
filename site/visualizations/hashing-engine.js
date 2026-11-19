/**
 * Original hash table practice engine; lecture conventions from
 * Chapter11Sept22-2026 slides 2–22 verified from source PPTX.
 */
export function divisionHash(key,m){if(!Number.isInteger(key)||key<0||!Number.isInteger(m)||m<1)throw new RangeError('integer key>=0 and m>0');return key%m;}
export function universalHash(key,a,b,p,m){
 if(![key,a,b,p,m].every(Number.isInteger)||key<0||a<=0||b<0||p<=m||m<1||a>=p||b>=p||key>=p)throw new RangeError('Require prime p>m, key in 0..p-1, 1<=a<p, 0<=b<p');
 return ((a*key+b)%p)%m;
}
export function chainTable(keys,m){
 if(!Array.isArray(keys)||keys.some(x=>!Number.isInteger(x)||x<0)||!Number.isInteger(m)||m<1||m>200)throw new RangeError('Nonnegative integer keys and m in 1..200');
 const slots=Array.from({length:m},()=>[]);for(const k of keys)slots[divisionHash(k,m)].unshift(k);
 return {slots,loadFactor:keys.length/m};
}
export function openAddress(keys,m,method='linear'){
 if(!Array.isArray(keys)||keys.some(x=>!Number.isInteger(x)||x<0)||!Number.isInteger(m)||m<1||m>200||!['linear','quadratic'].includes(method))throw new RangeError('Invalid input');
 const table=Array(m).fill(null),traces=[],failures=[];
 for(const key of keys){let path=[],inserted=false;for(let i=0;i<m;i++){let index=(divisionHash(key,m)+(method==='linear'?i:i*i))%m;path.push(index);if(table[index]===null){table[index]=key;inserted=true;break;}}
  traces.push({key,path,inserted});if(!inserted)failures.push(key);}
 return {table,traces,failures};
}
