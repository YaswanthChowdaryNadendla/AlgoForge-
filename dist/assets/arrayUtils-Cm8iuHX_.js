import{l as e}from"./flow-ClwwLNVS.js";import{g as t}from"./index-Bk_Ya7TM.js";var n=t(`clock`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`polyline`,{points:`12 6 12 12 16 14`,key:`68esgv`}]]),r=t(`database`,[[`ellipse`,{cx:`12`,cy:`5`,rx:`9`,ry:`3`,key:`msslwz`}],[`path`,{d:`M3 5V19A9 3 0 0 0 21 19V5`,key:`1wlel7`}],[`path`,{d:`M3 12A9 3 0 0 0 21 12`,key:`mv7ke4`}]]),i=t(`shuffle`,[[`path`,{d:`m18 14 4 4-4 4`,key:`10pe0f`}],[`path`,{d:`m18 2 4 4-4 4`,key:`pucp1d`}],[`path`,{d:`M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22`,key:`1ailkh`}],[`path`,{d:`M2 6h1.972a4 4 0 0 1 3.6 2.2`,key:`km57vx`}],[`path`,{d:`M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45`,key:`os18l9`}]]),a=t(`trending-up`,[[`path`,{d:`M16 7h6v6`,key:`box55l`}],[`path`,{d:`m22 7-8.5 8.5-5-5L2 17`,key:`1t1m79`}]]),o=e();function s({label:e,value:t,onChange:n,min:r=1,max:i=100,step:a=1,unit:s=``,className:c=``}){let l=(t-r)/(i-r)*100;return(0,o.jsxs)(`div`,{className:`flex flex-col gap-1.5 ${c}`,children:[(0,o.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,o.jsx)(`label`,{className:`text-xs font-medium text-slate-400`,children:e}),(0,o.jsxs)(`span`,{className:`text-xs font-mono font-semibold text-primary`,children:[t,s]})]}),(0,o.jsx)(`div`,{className:`relative`,children:(0,o.jsx)(`input`,{type:`range`,min:r,max:i,step:a,value:t,onChange:e=>n(Number(e.target.value)),className:`w-full h-1.5 rounded-full appearance-none cursor-pointer
                     bg-dark-700 outline-none
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:shadow-glow-sm
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:duration-200
                     [&::-webkit-slider-thumb]:hover:shadow-glow-md
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:border-none
                     [&::-moz-range-thumb]:shadow-glow-sm
                     [&::-moz-range-thumb]:cursor-pointer`,style:{background:`linear-gradient(to right, #3B82F6 0%, #3B82F6 ${l}%, #1E293B ${l}%, #1E293B 100%)`}})})]})}function c(e=50,t=5,n=100){return Array.from({length:e},()=>Math.floor(Math.random()*(n-t+1))+t)}function l(e){if(!e||!e.trim())return null;let t=e.split(/[,\s]+/).map(e=>parseInt(e.trim(),10)).filter(e=>!isNaN(e)&&e>0&&e<=200);return t.length>0?t:null}export{i as a,a as i,l as n,r as o,s as r,n as s,c as t};