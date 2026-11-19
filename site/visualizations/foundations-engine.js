/** Original foundational algorithm engines; course lecture notation takes precedence. */
export function mergeSortTrace(values){
 if(!Array.isArray(values)||values.some(x=>!Number.isFinite(x)))throw new RangeError('Finite numbers only');
 const trace=[];function rec(a,depth){if(a.length<=1)return a.slice();const mid=Math.floor(a.length/2),l=rec(a.slice(0,mid),depth+1),r=rec(a.slice(mid),depth+1),out=[];let i=0,j=0;while(i<l.length||j<r.length){if(j===r.length||(i<l.length&&l[i]<=r[j]))out.push(l[i++]);else out.push(r[j++]);}trace.push({depth,left:l.slice(),right:r.slice(),merged:out.slice()});return out;}
 return {sorted:rec(values,0),trace};
}
export function lomutoPartitionTrace(values){
 if(!Array.isArray(values)||values.some(x=>!Number.isFinite(x)))throw new RangeError('Finite numbers only');
 const a=values.slice();if(a.length===0)return {values:[],pivotIndex:-1,steps:[]};
 const pivot=a.at(-1),steps=[{j:0,boundary:-1,values:a.slice(),rule:'initial'}];let i=-1;
 for(let j=0;j<a.length-1;j++){if(a[j]<=pivot){i++;[a[i],a[j]]=[a[j],a[i]];}steps.push({j,boundary:i,values:a.slice(),rule:'processed elements through index '+j});}
 [a[i+1],a[a.length-1]]=[a[a.length-1],a[i+1]];steps.push({j:a.length-1,boundary:i+1,values:a.slice(),rule:'pivot placed'});return {values:a,pivotIndex:i+1,steps,pivot};
}
export function deterministicSelect(values,rank){
 if(!Array.isArray(values)||values.length===0||values.some(x=>!Number.isFinite(x))||!Number.isInteger(rank)||rank<1||rank>values.length)throw new RangeError('Rank must be in 1..n for finite nonempty values');
 const history=[];
 function select(a,k){if(a.length<=5){const sorted=a.slice().sort((x,y)=>x-y);history.push({size:a.length,pivot:sorted[Math.floor((sorted.length-1)/2)],note:'Base case'});return sorted[k-1];}
 const medians=[];for(let i=0;i<a.length;i+=5){const g=a.slice(i,i+5).sort((x,y)=>x-y);medians.push(g[Math.floor((g.length-1)/2)]);}
 const pivot=select(medians,Math.ceil(medians.length/2));const low=a.filter(x=>x<pivot),equal=a.filter(x=>x===pivot),high=a.filter(x=>x>pivot);
 history.push({size:a.length,pivot,low:low.length,equal:equal.length,high:high.length,note:'Partition at median of five-group medians'});
 if(k<=low.length)return select(low,k);
 if(k<=low.length+equal.length)return pivot;
 return select(high,k-low.length-equal.length);
 }
 return {value:select(values,rank),history};
}
export function recurrenceLevels(n,branch=2,divisor=2,power=1){
 if(!Number.isInteger(n)||n<1||n>1000000||!Number.isInteger(branch)||branch<1||branch>10||!Number.isInteger(divisor)||divisor<2||divisor>20||!Number.isInteger(power)||power<0||power>4)throw new RangeError('Supported: 1<=n<=1e6, 1<=a<=10, 2<=b<=20, 0<=p<=4');
 const rows=[];let problems=1,size=n,depth=0;
 while(size>=1&&depth<25){let cost=problems*Math.pow(size,power);rows.push({level:depth,problems,size,work:cost});size/=divisor;problems*=branch;depth++;}return rows;
}
