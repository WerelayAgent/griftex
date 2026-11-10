export function plotGate(lot){const fz=lot.facing==="n"?-1:1;return{x:lot.cx,z:lot.cz+fz*(lot.d/2+2.5),yaw:fz>0?0:Math.PI}}
