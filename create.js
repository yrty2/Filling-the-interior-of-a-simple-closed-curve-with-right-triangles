var maxiter=1;
var xam=2;
var yam=2;
function init(){
    var N=5;
    const range=[canvas.width/xam,canvas.height/yam];
    //createCells
    for(let i=0; i<xam; ++i){
        for(let j=0; j<yam; ++j){
            cells.push({
                size:[1,1],
                pos:[range[0]*i,range[1]*j],
                center:[range[0]*(i+0.5),range[1]*(j+0.5)],
                points:[],
                polygon:[]//triangle-list
            });
            //不等式で図形内に含まれるかどうかを定義する。
            for(let k=0; k<N; ++k){
                plot(cells.length-1,vec.prod([Math.cos(2*Math.PI*k/N),Math.sin(2*Math.PI*k/N)],400/Math.max(xam,yam)));
            }
            midm(cells.length-1,3);
            generatepolygon(cells.length-1);
        }
    }
}
init();
function midm(index,n){
    for(let k=0; k<n; ++k){
        for(const p of cells[index].points){
            if(p.end<k){
                p.end=k;
                var q=nextPoint(index,p,k);
                //中点を計算する。
                var pq=quot(sum(p.pos,q.pos),2);
                const r=length(dec(q.pos,p.pos));
                const theta=2*Math.PI*Math.random();
                addMidpoint(index,sum(pq,prod([Math.cos(theta),Math.sin(theta)],r/4)),p.seed,k);
            }
        }
    }
}
function nextPoint(index,p,k){
    var id=cells[index].points.findIndex(e=>e.seed==p.seed);
    while(cells[index].points[id].end>=k){
        id=(id+1)%cells[index].points.length;
        if(id==0){
            break;
        }
    }
    return cells[index].points[id];
}
function addMidpoint(index,pos,seed,k){
    var id=cells[index].points.findIndex(e=>e.seed==seed);
    var e={pos:pos,seed:Math.random(),end:k};
    var v=cells[index].points.slice(id+1,cells[index].points.length);
    var u=cells[index].points.slice(0,id+1);
    u.push(e);
    cells[index].points=u.slice();
    for(let k=0; k<v.length; ++k){
        cells[index].points.push(v[k]);
    }
}
function generatepolygon(index){
    var c=cells[index];
    var g=[0,0];
    for(const p of c.points){
        p.hantei=false;
        g=sum(g,p.pos);
    }
    //開始点の定義
    g=quot(g,c.points.length);
    function hantei(g,iter,maxl){
        var ml=0;
        var list=[];
    for(let k=0; k<c.points.length; ++k){
        if(!c.points[k].hantei && !c.points[(k+1)%c.points.length].hantei){
        var p=c.points[k].pos;//pgq
        var q=c.points[(k+1)%c.points.length].pos;
        //if(hasIntersection(index,normalize(dec(p,g)),g,k,g,p) || hasIntersection(index,normalize(dec(q,g)),g,k,g,q)){
        //    list.push(p);
        //}else{
            if(ml<length(dec(p,g))){
            ml=length(dec(p,g));
            }
            if(length(dec(p,g))<maxl/2 || iter==0){
        //直角三角形に分割
        var t1=arg(dec(q,p))-arg(dec(g,p));
        var t2=arg(dec(p,q))-arg(dec(g,q));
        var t3=arg(dec(p,g))-arg(dec(q,g));
        //theta=Math.PI*(5-2)/5;
        var d;
        if(Math.cos(t1)>=0 && Math.cos(t3)>=0){
        d=sum(p,prod(normalize(dec(g,p)),length(dec(q,p))*Math.cos(t1)));
        }else if(Math.cos(t1)>=0 && Math.cos(t2)>=0){
        d=sum(q,prod(normalize(dec(p,q)),length(dec(g,q))*Math.cos(t2)));
        }else{
        d=sum(g,prod(normalize(dec(q,g)),length(dec(p,g))*Math.cos(t3)));
        }
        c.polygon.push([p,g,d]);
        c.polygon.push([p,q,d]);
            c.points[k].hantei=true;
            if(iter>0){
                c.points[(k+1)%c.points.length].hantei=true;
            }
        }
            //}
    }
        }
        /*var ng=[0,0];
        //再帰処理
        for(const l of list){
            ng=sum(ng,p);
        }
        if(list.length>0 || iter==maxiter){
        hantei(quot(ng,list.length),iter+1,ml);
        }*/
        }
    hantei(g,0);
}
//今のところは考えないでおく
function hasIntersection(index,direction1,offset1,ind2,start,end){
    for(let k=0; k<cells[index].points.length; ++k){
        if(k!=ind2){
        var p=cells[index].points[k].pos;
        var q=cells[index].points[(k+1)%cells[index].points.length].pos;
        var i=intersection(direction1,normalize(dec(q,p)),offset1,p);
        if(Math.min(start[0],end[0])<i[0] && i[0]<Math.max(start[0],end[0]) && Math.min(start[1],end[1])<i[1] && i[1]<Math.max(start[1],end[1]) && 
          Math.min(p[0],q[0])<i[0] && i[0]<Math.max(p[0],q[0]) && Math.min(p[1],q[1])<i[1] && i[1]<Math.max(p[1],q[1])){
            //addvertex(i);
            return true;
        }
            }
    }
    return false;
}
function arg(p){
    return Math.atan2(p[1],p[0]);
}