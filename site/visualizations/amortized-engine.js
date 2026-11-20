/** Original dynamic-array amortization practice; syllabus Section 17.1–17.2. */
export function doublingTrace(n){
 if(!Number.isInteger(n)||n<0||n>20000)throw new RangeError('n must be an integer in 0..20000');
 let capacity=1,used=0,copies=0;const steps=[];
 for(let i=0;i<n;i++){let copied=0;if(used===capacity){copied=used;capacity*=2;copies+=copied;}used++;steps.push({operation:i+1,capacity,used,copied,totalCopies:copies,actualCost:copied+1,aggregateCost:copies+used});}
 return {steps,capacity,used,totalCopies:copies,totalWork:copies+n};
}

/** Independent binary-counter aggregate/potential illustration, excluding overflow. */
export function binaryCounterTrace(width,increments){
 if(!Number.isInteger(width)||width<1||width>20||!Number.isInteger(increments)||increments<0||increments>Math.pow(2,width)-1)
  throw new RangeError('Width 1..20; increments must be in 0..2^width-1 (no overflow)');
 const bits=Array(width).fill(0),steps=[];let totalFlips=0;
 for(let op=1;op<=increments;op++){
  const oldPotential=bits.reduce((a,b)=>a+b,0);let flips=0,i=0;
  while(i<width&&bits[i]===1){bits[i]=0;flips++;i++;}
  if(i===width)throw new Error('Unexpected counter overflow');
  bits[i]=1;flips++;totalFlips+=flips;
  const potential=bits.reduce((a,b)=>a+b,0);
  steps.push({operation:op,bitString:bits.slice().reverse().join(''),flips,potential,amortizedCost:flips+potential-oldPotential,totalFlips});
 }
 return {steps,totalFlips,finalBits:bits.slice().reverse().join('')};
}
