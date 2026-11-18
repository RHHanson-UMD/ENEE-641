// Original Chapter 15 DP explanations. Matrices use zero-based JS indices.
export function matrixChain(dimensions){
 if(!Array.isArray(dimensions)||dimensions.length<2||dimensions.length>12||dimensions.some(x=>!Number.isSafeInteger(x)||x<=0))throw Error('Use 1–11 matrices and positive dimensions');
 const n=dimensions.length-1,cost=Array.from({length:n},()=>Array(n).fill(null)),split=Array.from({length:n},()=>Array(n).fill(null));
 for(let i=0;i<n;i++)cost[i][i]=0;
 const stages=[{length:1,cost:cost.map(r=>[...r]),split:split.map(r=>[...r]),updates:[]}];
 for(let len=2;len<=n;len++){
  const updates=[];
  for(let i=0;i<=n-len;i++){
   const j=i+len-1;let best=Infinity,bestK=-1,candidates=[];
   for(let k=i;k<j;k++){
    const value=cost[i][k]+cost[k+1][j]+dimensions[i]*dimensions[k+1]*dimensions[j+1];
    candidates.push({k,value});if(value<best){best=value;bestK=k}
   }
   cost[i][j]=best;split[i][j]=bestK;updates.push({i,j,best,k:bestK,candidates});
  }
  stages.push({length:len,cost:cost.map(r=>[...r]),split:split.map(r=>[...r]),updates});
 }
 function format(i,j){if(i===j)return 'A'+(i+1);const k=split[i][j];return '('+format(i,k)+' × '+format(k+1,j)+')'}
 return {cost:cost[0][n-1],parenthesization:format(0,n-1),stages};
}
export function bruteMatrixChain(dimensions){
 const n=dimensions.length-1;
 function work(i,j){
  if(i===j)return 0;let best=Infinity;
  for(let k=i;k<j;k++)best=Math.min(best,work(i,k)+work(k+1,j)+dimensions[i]*dimensions[k+1]*dimensions[j+1]);
  return best;
 }
 return work(0,n-1);
}
export function lcs(x,y){
 const a=Array.from(x),b=Array.from(y),m=a.length,n=b.length;
 if(m>30||n>30)throw Error('Sequences are limited to 30 symbols');
 const table=Array.from({length:m+1},()=>Array(n+1).fill(0)),stages=[{row:0,table:table.map(r=>[...r])}];
 for(let i=1;i<=m;i++){
  for(let j=1;j<=n;j++)table[i][j]=a[i-1]===b[j-1]?table[i-1][j-1]+1:Math.max(table[i-1][j],table[i][j-1]);
  stages.push({row:i,table:table.map(r=>[...r])});
 }
 const result=[];let i=m,j=n;
 while(i&&j){
  if(a[i-1]===b[j-1]){result.push(a[i-1]);i--;j--;}
  else if(table[i-1][j]>=table[i][j-1])i--;else j--;
 }
 return {length:table[m][n],sequence:result.reverse().join(''),stages};
}
export function isSubsequence(candidate,text){
 const chars=Array.from(text);let i=0;
 for(const x of Array.from(candidate)){while(i<chars.length&&chars[i]!==x)i++;if(i===chars.length)return false;i++}
 return true;
}
export function bruteLcsLength(a,b){
 const x=Array.from(a);if(x.length>16)throw Error('Oracle limit 16 chars');
 let best=0;
 for(let mask=0;mask<(1<<x.length);mask++){
  const candidate=x.filter((_,i)=>mask&(1<<i)).join('');
  if(candidate.length>best&&isSubsequence(candidate,b))best=candidate.length;
 }
 return best;
}
