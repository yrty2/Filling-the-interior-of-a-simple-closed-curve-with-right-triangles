var vertex=[];
var cells=[];
const canvas=document.querySelector(".canvas");
canvas.style.border="4px solid";
const ctx=canvas.getContext("2d");
function translate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const c of cells){
    for(let k=0; k<c.points.length; ++k){
        line(c.points[k].pos,c.points[(k+1)%c.points.length].pos);
    }
    for(const p of c.polygon){
        line(p[0],p[1]);
        line(p[1],p[2]);
        line(p[2],p[0]);
    }
    }
    for(const v of vertex){
        ctx.beginPath();
        ctx.arc(v[0],v[1],1,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    requestAnimationFrame(translate);
}
translate();
function line(p1,p2){
    ctx.strokeStyle=`hsl(${Math.atan2((p1[1]+p2[1]-canvas.width)/2,(p1[0]+p2[0]-canvas.height)/2)/Math.PI*180},100%,30%)`;
    ctx.beginPath();
    ctx.lineTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.stroke();
    ctx.closePath();
}
function plot(index,pos){
    cells[index].points.push({pos:sum(pos,cells[index].center),end:-1,seed:Math.random()});
}
function sum(p1,p2){
    return [p1[0]+p2[0],p1[1]+p2[1]];
}
function dec(p1,p2){
    return [p1[0]-p2[0],p1[1]-p2[1]];
}
function prod(p1,sc){
    return [p1[0]*sc,p1[1]*sc];
}
function quot(p1,sc){
    return [p1[0]/sc,p1[1]/sc];
}
function length(p1){
    return Math.hypot(p1[0],p1[1]);
}
function normalize(p1){
    return quot(p1,length(p1));
}
function intersection(direction1,direction2,offset1,offset2){
    const tanA=Math.tan(Math.atan2(direction1[1],direction1[0]));
    const tanB=Math.tan(Math.atan2(direction2[1],direction2[0]));
    const a=offset1[0];
    const b=offset1[1];
    const c=offset2[0];
    const d=offset2[1];
    const res=[
        (a*tanA-c*tanB+d-b)/(tanA-tanB),
        tanA*((a-c)*tanB+d-b)/(tanA-tanB)+b
    ];
    return res;
}
function addvertex(p){
    vertex.push(p);
}