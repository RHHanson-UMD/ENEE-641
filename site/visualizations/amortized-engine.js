/** Original dynamic-array amortization practice; syllabus Section 17.1–17.2. */
export function doublingTrace(n){
 if(!Number.isInteger(n)||n<0||n>20000)throw new RangeError('n must be an integer in 0..20000');
 let capacity=1,used=0,copies=0;const steps=[];
 for(let i=0;i<n;i++){let copied=0;if(used===capacity){copied=used;capacity*=2;copies+=copied;}used++;steps.push({operation:i+1,capacity,used,copied,totalCopies:copies,actualCost:copied+1,aggregateCost:copies+used});}
 return {steps,capacity,used,totalCopies:copies,totalWork:copies+n};
}
