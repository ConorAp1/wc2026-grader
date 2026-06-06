import { useState, useEffect, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronDown, ChevronUp, TrendingUp, RefreshCw, AlertCircle, CheckCircle2, Trophy } from "lucide-react";

const T = {
  'Mexico':{ t:2,f:'🇲🇽',c:'CONCACAF' }, 'South Africa':{ t:4,f:'🇿🇦',c:'CAF' },
  'South Korea':{ t:2,f:'🇰🇷',c:'AFC' }, 'Czechia':{ t:3,f:'🇨🇿',c:'UEFA' },
  'Canada':{ t:3,f:'🇨🇦',c:'CONCACAF' }, 'Bosnia and Herz.':{ t:3,f:'🇧🇦',c:'UEFA' },
  'Qatar':{ t:4,f:'🇶🇦',c:'AFC' }, 'Switzerland':{ t:2,f:'🇨🇭',c:'UEFA' },
  'Brazil':{ t:1,f:'🇧🇷',c:'CONMEBOL' }, 'Morocco':{ t:2,f:'🇲🇦',c:'CAF' },
  'Haiti':{ t:4,f:'🇭🇹',c:'CONCACAF' }, 'Scotland':{ t:3,f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',c:'UEFA' },
  'USMNT':{ t:2,f:'🇺🇸',c:'CONCACAF' }, 'Paraguay':{ t:3,f:'🇵🇾',c:'CONMEBOL' },
  'Australia':{ t:3,f:'🇦🇺',c:'AFC' }, 'Türkiye':{ t:3,f:'🇹🇷',c:'UEFA' },
  'Germany':{ t:1,f:'🇩🇪',c:'UEFA' }, 'Curaçao':{ t:4,f:'🇨🇼',c:'CONCACAF' },
  "Côte d'Ivoire":{ t:3,f:'🇨🇮',c:'CAF' }, 'Ecuador':{ t:3,f:'🇪🇨',c:'CONMEBOL' },
  'Netherlands':{ t:1,f:'🇳🇱',c:'UEFA' }, 'Japan':{ t:2,f:'🇯🇵',c:'AFC' },
  'Sweden':{ t:3,f:'🇸🇪',c:'UEFA' }, 'Tunisia':{ t:3,f:'🇹🇳',c:'CAF' },
  'Belgium':{ t:2,f:'🇧🇪',c:'UEFA' }, 'Egypt':{ t:3,f:'🇪🇬',c:'CAF' },
  'Iran':{ t:3,f:'🇮🇷',c:'AFC' }, 'New Zealand':{ t:4,f:'🇳🇿',c:'OFC' },
  'Spain':{ t:1,f:'🇪🇸',c:'UEFA' }, 'Cabo Verde':{ t:4,f:'🇨🇻',c:'CAF' },
  'Saudi Arabia':{ t:3,f:'🇸🇦',c:'AFC' }, 'Uruguay':{ t:2,f:'🇺🇾',c:'CONMEBOL' },
  'France':{ t:1,f:'🇫🇷',c:'UEFA' }, 'Senegal':{ t:2,f:'🇸🇳',c:'CAF' },
  'Iraq':{ t:4,f:'🇮🇶',c:'AFC' }, 'Norway':{ t:2,f:'🇳🇴',c:'UEFA' },
  'Argentina':{ t:1,f:'🇦🇷',c:'CONMEBOL' }, 'Algeria':{ t:3,f:'🇩🇿',c:'CAF' },
  'Austria':{ t:3,f:'🇦🇹',c:'UEFA' }, 'Jordan':{ t:4,f:'🇯🇴',c:'AFC' },
  'Portugal':{ t:1,f:'🇵🇹',c:'UEFA' }, 'DR Congo':{ t:4,f:'🇨🇩',c:'CAF' },
  'Uzbekistan':{ t:4,f:'🇺🇿',c:'AFC' }, 'Colombia':{ t:2,f:'🇨🇴',c:'CONMEBOL' },
  'England':{ t:1,f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',c:'UEFA' }, 'Croatia':{ t:2,f:'🇭🇷',c:'UEFA' },
  'Ghana':{ t:3,f:'🇬🇭',c:'CAF' }, 'Panama':{ t:4,f:'🇵🇦',c:'CONCACAF' },
};

const FIXTURES = [
  { id:'A1',g:'A',md:1,date:'Jun 11',home:'Mexico',away:'South Africa',venue:'Azteca, Mexico City' },
  { id:'A2',g:'A',md:1,date:'Jun 11',home:'South Korea',away:'Czechia',venue:'Akron, Zapopan' },
  { id:'A3',g:'A',md:2,date:'Jun 18',home:'Czechia',away:'South Africa',venue:'Mercedes-Benz, Atlanta' },
  { id:'A4',g:'A',md:2,date:'Jun 18',home:'Mexico',away:'South Korea',venue:'Akron, Zapopan' },
  { id:'A5',g:'A',md:3,date:'Jun 24',home:'Czechia',away:'Mexico',venue:'Azteca, Mexico City' },
  { id:'A6',g:'A',md:3,date:'Jun 24',home:'South Africa',away:'South Korea',venue:'BBVA, Guadalupe' },
  { id:'B1',g:'B',md:1,date:'Jun 12',home:'Canada',away:'Bosnia and Herz.',venue:'BMO Field, Toronto' },
  { id:'B2',g:'B',md:1,date:'Jun 13',home:'Qatar',away:'Switzerland',venue:"Levi's, Santa Clara" },
  { id:'B3',g:'B',md:2,date:'Jun 18',home:'Switzerland',away:'Bosnia and Herz.',venue:'SoFi, Inglewood' },
  { id:'B4',g:'B',md:2,date:'Jun 18',home:'Canada',away:'Qatar',venue:'BC Place, Vancouver' },
  { id:'B5',g:'B',md:3,date:'Jun 24',home:'Switzerland',away:'Canada',venue:'BC Place, Vancouver' },
  { id:'B6',g:'B',md:3,date:'Jun 24',home:'Bosnia and Herz.',away:'Qatar',venue:'Lumen Field, Seattle' },
  { id:'C1',g:'C',md:1,date:'Jun 13',home:'Brazil',away:'Morocco',venue:'MetLife, E. Rutherford' },
  { id:'C2',g:'C',md:1,date:'Jun 13',home:'Haiti',away:'Scotland',venue:'Gillette, Foxborough' },
  { id:'C3',g:'C',md:2,date:'Jun 19',home:'Scotland',away:'Morocco',venue:'Gillette, Foxborough' },
  { id:'C4',g:'C',md:2,date:'Jun 19',home:'Brazil',away:'Haiti',venue:'Lincoln Financial, Phila.' },
  { id:'C5',g:'C',md:3,date:'Jun 24',home:'Scotland',away:'Brazil',venue:'Hard Rock, Miami Gardens' },
  { id:'C6',g:'C',md:3,date:'Jun 24',home:'Morocco',away:'Haiti',venue:'Mercedes-Benz, Atlanta' },
  { id:'D1',g:'D',md:1,date:'Jun 12',home:'USMNT',away:'Paraguay',venue:'SoFi, Inglewood' },
  { id:'D2',g:'D',md:1,date:'Jun 13',home:'Australia',away:'Türkiye',venue:'BC Place, Vancouver' },
  { id:'D3',g:'D',md:2,date:'Jun 19',home:'Türkiye',away:'Paraguay',venue:"Levi's, Santa Clara" },
  { id:'D4',g:'D',md:2,date:'Jun 19',home:'USMNT',away:'Australia',venue:'Lumen Field, Seattle' },
  { id:'D5',g:'D',md:3,date:'Jun 25',home:'Türkiye',away:'USMNT',venue:'SoFi, Inglewood' },
  { id:'D6',g:'D',md:3,date:'Jun 25',home:'Paraguay',away:'Australia',venue:"Levi's, Santa Clara" },
  { id:'E1',g:'E',md:1,date:'Jun 14',home:'Germany',away:'Curaçao',venue:'NRG Stadium, Houston' },
  { id:'E2',g:'E',md:1,date:'Jun 14',home:"Côte d'Ivoire",away:'Ecuador',venue:'Lincoln Financial, Phila.' },
  { id:'E3',g:'E',md:2,date:'Jun 20',home:'Germany',away:"Côte d'Ivoire",venue:'BMO Field, Toronto' },
  { id:'E4',g:'E',md:2,date:'Jun 20',home:'Ecuador',away:'Curaçao',venue:'Arrowhead, Kansas City' },
  { id:'E5',g:'E',md:3,date:'Jun 25',home:'Ecuador',away:'Germany',venue:'MetLife, E. Rutherford' },
  { id:'E6',g:'E',md:3,date:'Jun 25',home:'Curaçao',away:"Côte d'Ivoire",venue:'Lincoln Financial, Phila.' },
  { id:'F1',g:'F',md:1,date:'Jun 14',home:'Netherlands',away:'Japan',venue:"AT&T, Arlington" },
  { id:'F2',g:'F',md:1,date:'Jun 14',home:'Sweden',away:'Tunisia',venue:'BBVA, Guadalupe' },
  { id:'F3',g:'F',md:2,date:'Jun 20',home:'Netherlands',away:'Sweden',venue:'NRG Stadium, Houston' },
  { id:'F4',g:'F',md:2,date:'Jun 20',home:'Tunisia',away:'Japan',venue:'BBVA, Guadalupe' },
  { id:'F5',g:'F',md:3,date:'Jun 25',home:'Tunisia',away:'Netherlands',venue:"AT&T, Arlington" },
  { id:'F6',g:'F',md:3,date:'Jun 25',home:'Japan',away:'Sweden',venue:'Arrowhead, Kansas City' },
  { id:'G1',g:'G',md:1,date:'Jun 15',home:'Belgium',away:'Egypt',venue:'Lumen Field, Seattle' },
  { id:'G2',g:'G',md:1,date:'Jun 15',home:'Iran',away:'New Zealand',venue:'SoFi, Inglewood' },
  { id:'G3',g:'G',md:2,date:'Jun 21',home:'Belgium',away:'Iran',venue:'SoFi, Inglewood' },
  { id:'G4',g:'G',md:2,date:'Jun 21',home:'New Zealand',away:'Egypt',venue:'BC Place, Vancouver' },
  { id:'G5',g:'G',md:3,date:'Jun 26',home:'New Zealand',away:'Belgium',venue:'BC Place, Vancouver' },
  { id:'G6',g:'G',md:3,date:'Jun 26',home:'Egypt',away:'Iran',venue:'Lumen Field, Seattle' },
  { id:'H1',g:'H',md:1,date:'Jun 15',home:'Spain',away:'Cabo Verde',venue:'Mercedes-Benz, Atlanta' },
  { id:'H2',g:'H',md:1,date:'Jun 15',home:'Saudi Arabia',away:'Uruguay',venue:'Hard Rock, Miami Gardens' },
  { id:'H3',g:'H',md:2,date:'Jun 21',home:'Spain',away:'Saudi Arabia',venue:'Mercedes-Benz, Atlanta' },
  { id:'H4',g:'H',md:2,date:'Jun 21',home:'Uruguay',away:'Cabo Verde',venue:'Hard Rock, Miami Gardens' },
  { id:'H5',g:'H',md:3,date:'Jun 26',home:'Uruguay',away:'Spain',venue:'NRG Stadium, Houston' },
  { id:'H6',g:'H',md:3,date:'Jun 26',home:'Cabo Verde',away:'Saudi Arabia',venue:'Akron, Zapopan' },
  { id:'I1',g:'I',md:1,date:'Jun 16',home:'France',away:'Senegal',venue:'MetLife, E. Rutherford' },
  { id:'I2',g:'I',md:1,date:'Jun 16',home:'Iraq',away:'Norway',venue:'Gillette, Foxborough' },
  { id:'I3',g:'I',md:2,date:'Jun 22',home:'France',away:'Iraq',venue:'Lincoln Financial, Phila.' },
  { id:'I4',g:'I',md:2,date:'Jun 22',home:'Norway',away:'Senegal',venue:'MetLife, E. Rutherford' },
  { id:'I5',g:'I',md:3,date:'Jun 26',home:'Norway',away:'France',venue:'Gillette, Foxborough' },
  { id:'I6',g:'I',md:3,date:'Jun 26',home:'Senegal',away:'Iraq',venue:'BMO Field, Toronto' },
  { id:'J1',g:'J',md:1,date:'Jun 16',home:'Argentina',away:'Algeria',venue:'Arrowhead, Kansas City' },
  { id:'J2',g:'J',md:1,date:'Jun 16',home:'Austria',away:'Jordan',venue:"Levi's, Santa Clara" },
  { id:'J3',g:'J',md:2,date:'Jun 22',home:'Argentina',away:'Austria',venue:"AT&T, Arlington" },
  { id:'J4',g:'J',md:2,date:'Jun 22',home:'Jordan',away:'Algeria',venue:"Levi's, Santa Clara" },
  { id:'J5',g:'J',md:3,date:'Jun 27',home:'Jordan',away:'Argentina',venue:"AT&T, Arlington" },
  { id:'J6',g:'J',md:3,date:'Jun 27',home:'Algeria',away:'Austria',venue:'Arrowhead, Kansas City' },
  { id:'K1',g:'K',md:1,date:'Jun 17',home:'Portugal',away:'DR Congo',venue:'NRG Stadium, Houston' },
  { id:'K2',g:'K',md:1,date:'Jun 17',home:'Uzbekistan',away:'Colombia',venue:'Azteca, Mexico City' },
  { id:'K3',g:'K',md:2,date:'Jun 23',home:'Portugal',away:'Uzbekistan',venue:'NRG Stadium, Houston' },
  { id:'K4',g:'K',md:2,date:'Jun 23',home:'Colombia',away:'DR Congo',venue:'Akron, Zapopan' },
  { id:'K5',g:'K',md:3,date:'Jun 27',home:'Colombia',away:'Portugal',venue:'Hard Rock, Miami Gardens' },
  { id:'K6',g:'K',md:3,date:'Jun 27',home:'DR Congo',away:'Uzbekistan',venue:'Mercedes-Benz, Atlanta' },
  { id:'L1',g:'L',md:1,date:'Jun 17',home:'England',away:'Croatia',venue:"AT&T, Arlington" },
  { id:'L2',g:'L',md:1,date:'Jun 17',home:'Ghana',away:'Panama',venue:'BMO Field, Toronto' },
  { id:'L3',g:'L',md:2,date:'Jun 23',home:'England',away:'Ghana',venue:'Gillette, Foxborough' },
  { id:'L4',g:'L',md:2,date:'Jun 23',home:'Panama',away:'Croatia',venue:'BMO Field, Toronto' },
  { id:'L5',g:'L',md:3,date:'Jun 27',home:'Panama',away:'England',venue:'MetLife, E. Rutherford' },
  { id:'L6',g:'L',md:3,date:'Jun 27',home:'Croatia',away:'Ghana',venue:'Lincoln Financial, Phila.' },
];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const FREQ_MAP = {
  '1-0':35,'0-1':35,'2-1':32,'1-2':32,'2-0':28,'0-2':28,
  '1-1':25,'0-0':22,'3-1':20,'1-3':20,'3-0':18,'0-3':18,
  '3-2':14,'2-3':14,'2-2':13,'4-1':11,'1-4':11,
  '4-0':9,'0-4':9,'4-2':7,'2-4':7,'5-1':5,'1-5':5,
  '5-0':4,'0-5':4,'4-3':3,'3-4':3,'5-2':3,'2-5':3,
  '6-0':2,'0-6':2,'6-1':2,'1-6':2,'7-0':1,'0-7':1,
};

function freqScore(h,a){ return FREQ_MAP[`${h}-${a}`]??1; }

function matchdayScore(md,total){
  if(md===1){ if(total>=2&&total<=3)return 20; if(total===1||total===4)return 15; if(total===0)return 10; return 5; }
  if(md===2){ if(total>=2&&total<=4)return 20; if(total===1||total===5)return 13; if(total===0)return 6; return 4; }
  if(total<=1)return 20; if(total===2)return 16; if(total===3)return 11; return 6;
}

function matchupScore(homeTeam,awayTeam,h,a){
  const ht=T[homeTeam]?.t??3, at=T[awayTeam]?.t??3;
  const gap=at-ht, hd=h-a, tot=h+a;
  if(gap>=2){ if(hd>=3&&tot>=3)return 30; if(hd>=2&&tot>=2)return 25; if(hd===1)return 16; if(hd===0)return 8; return 3; }
  if(gap===1){ if(hd>=1&&hd<=2&&tot>=1)return 27; if(hd===3)return 20; if(hd===0)return 20; if(hd<0&&hd>=-1)return 14; return 8; }
  if(gap===0){ if(Math.abs(hd)<=1&&tot<=3)return 28; if(Math.abs(hd)===2&&tot<=4)return 20; if(Math.abs(hd)>=3)return 10; return 22; }
  if(gap===-1){ if(hd>=-1&&hd<=0)return 25; if(hd===-2)return 22; if(hd===1)return 15; if(hd>=2)return 6; return 18; }
  if(hd<=-2&&tot>=2)return 28; if(hd===-1)return 16; if(hd===0)return 10; if(hd>=1)return 3; return 18;
}

function poolEdgeScore(homeTeam,awayTeam,h,a){
  const ht=T[homeTeam]?.t??3, at=T[awayTeam]?.t??3;
  const gap=at-ht, hd=h-a, tot=h+a;
  if(ht<=1&&at>=3){ if(h>=3&&a===0)return 3; if(h===2&&a===0)return 9; if(hd===1&&tot<=2)return 15; if(h>=2&&a>=1)return 12; return 8; }
  if(Math.abs(gap)<=1){ if(hd===0)return 13; if(a===0&&h>=3)return 3; if(tot<=2&&Math.abs(hd)<=1)return 13; if(Math.abs(hd)>=3)return 5; return 10; }
  if(ht>=3&&at<=2){ if(hd>=1)return 14; if(hd===0)return 11; return 8; }
  return 10;
}

function rateScore(fixture,h,a){
  if(h==null||a==null)return null;
  const f=freqScore(h,a), md=matchdayScore(fixture.md,h+a);
  const mu=matchupScore(fixture.home,fixture.away,h,a);
  const pe=poolEdgeScore(fixture.home,fixture.away,h,a);
  return { total:Math.min(100,f+md+mu+pe), freq:f, md, mu, pe };
}

function getOdds(homeTeam,awayTeam){
  const ht=T[homeTeam]?.t??3, at=T[awayTeam]?.t??3;
  const gap=at-ht;
  const tbl={4:[1.10,8.5,28],3:[1.28,5.2,10.5],2:[1.52,4.0,6.2],1:[1.80,3.5,4.8],0:[2.30,3.35,3.10],'-1':[3.60,3.40,2.05],'-2':[6.50,3.80,1.55],'-3':[11.0,5.50,1.30],'-4':[28.0,8.50,1.12]};
  const k=Math.max(-4,Math.min(4,gap)).toString();
  return tbl[k]??[2.30,3.35,3.10];
}

function ratingColor(s){ if(s==null)return '#94a3b8'; if(s<40)return '#ef4444'; if(s<55)return '#f97316'; if(s<68)return '#eab308'; if(s<82)return '#22c55e'; return '#15b26b'; }
function ratingLabel(s){ if(s==null)return '—'; if(s<40)return 'Risky'; if(s<55)return 'Weak'; if(s<68)return 'Fair'; if(s<82)return 'Good'; return 'Sharp'; }
function mdColor(md){ return md===1?'#6366f1':md===2?'#f59e0b':'#64748b'; }

function ScoreStepper({value,onChange}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:4}}>
      <button onClick={()=>onChange(Math.max(0,value-1))} style={{width:28,height:28,borderRadius:'50%',border:'none',background:'#e2e8f0',color:'#334155',fontWeight:'bold',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>−</button>
      <span style={{width:22,textAlign:'center',fontWeight:'bold',fontSize:18,color:'#0f172a',fontFamily:'monospace'}}>{value}</span>
      <button onClick={()=>onChange(Math.min(9,value+1))} style={{width:28,height:28,borderRadius:'50%',border:'none',background:'#e2e8f0',color:'#334155',fontWeight:'bold',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>+</button>
    </div>
  );
}

function RatingBadge({rating,size='md'}){
  const color=ratingColor(rating?.total??null);
  const s=size==='lg'?52:44;
  return(
    <div style={{width:s,height:s,borderRadius:'50%',border:`3px solid ${color}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:`${color}18`,flexShrink:0}}>
      {rating?(<><span style={{fontSize:13,fontWeight:900,color,lineHeight:1,fontFamily:'monospace'}}>{rating.total}</span><span style={{fontSize:8,color,fontWeight:700,letterSpacing:'0.05em'}}>{ratingLabel(rating.total)}</span></>):(<span style={{fontSize:11,color:'#94a3b8'}}>?</span>)}
    </div>
  );
}

function Breakdown({rating,fixture}){
  if(!rating)return null;
  const rows=[
    {label:'Scoreline frequency',desc:'How often this exact score appears in WC history',val:rating.freq,max:35,icon:'📊'},
    {label:'Matchday fit',desc:`MD${fixture.md} — does goal count match the matchday pattern?`,val:rating.md,max:20,icon:'📅'},
    {label:'Matchup logic',desc:'Does the result reflect the team quality gap?',val:rating.mu,max:30,icon:'⚖️'},
    {label:'Pool edge',desc:'Rare correct picks earn bonus points.',val:rating.pe,max:15,icon:'🎯'},
  ];
  return(
    <div style={{background:'#f8fafc',borderTop:'1px solid #e2e8f0',padding:'14px 16px'}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',color:'#64748b',textTransform:'uppercase',marginBottom:10}}>Score Breakdown</div>
      {rows.map(r=>(
        <div key={r.label} style={{marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
            <span style={{fontSize:11,color:'#334155',fontWeight:600}}>{r.icon} {r.label}</span>
            <span style={{fontSize:11,fontFamily:'monospace',fontWeight:700,color:ratingColor(Math.round(r.val/r.max*100))}}>{r.val}/{r.max}</span>
          </div>
          <div style={{height:5,borderRadius:3,background:'#e2e8f0',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(r.val/r.max)*100}%`,background:ratingColor(Math.round(r.val/r.max*100)),borderRadius:3,transition:'width 0.3s ease'}}/>
          </div>
          <div style={{fontSize:9,color:'#94a3b8',marginTop:2}}>{r.desc}</div>
        </div>
      ))}
    </div>
  );
}

function FixtureRow({fixture,pick,onPick}){
  const [expanded,setExpanded]=useState(false);
  const rating=useMemo(()=>{
    if(pick?.h==null||pick?.a==null)return null;
    return rateScore(fixture,pick.h,pick.a);
  },[fixture,pick]);
  const odds=useMemo(()=>getOdds(fixture.home,fixture.away),[fixture]);
  const hasInput=pick?.h!=null;
  return(
    <div style={{background:'#fff',borderRadius:8,border:'1px solid #e2e8f0',overflow:'hidden',marginBottom:8}}>
      <div style={{display:'flex',alignItems:'center',padding:'10px 12px',gap:8}}>
        <div style={{flexShrink:0,minWidth:36}}>
          <div style={{background:mdColor(fixture.md),color:'#fff',borderRadius:4,fontSize:8,fontWeight:800,letterSpacing:'1px',padding:'2px 6px',textTransform:'uppercase',fontFamily:'monospace',marginBottom:2,textAlign:'center'}}>MD{fixture.md}</div>
          <div style={{fontSize:8,color:'#94a3b8',fontFamily:'monospace',textAlign:'center'}}>{fixture.date}</div>
        </div>
        <div style={{flex:1,textAlign:'right',minWidth:0}}>
          <div style={{fontWeight:700,fontSize:12,color:'#0f172a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{T[fixture.home]?.f} {fixture.home}</div>
          <div style={{fontSize:8,color:'#64748b'}}>{T[fixture.home]?.c} T{T[fixture.home]?.t}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
          <ScoreStepper value={pick?.h??0} onChange={v=>onPick({h:v,a:pick?.a??0})}/>
          <span style={{fontWeight:900,color:'#94a3b8',fontSize:14}}>–</span>
          <ScoreStepper value={pick?.a??0} onChange={v=>onPick({h:pick?.h??0,a:v})}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:12,color:'#0f172a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{T[fixture.away]?.f} {fixture.away}</div>
          <div style={{fontSize:8,color:'#64748b'}}>{T[fixture.away]?.c} T{T[fixture.away]?.t}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
          <RatingBadge rating={hasInput?rating:null}/>
          <button onClick={()=>setExpanded(e=>!e)} style={{background:'none',border:'none',cursor:'pointer',color:'#94a3b8',padding:0,display:'flex',alignItems:'center'}}>
            {expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}
          </button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',padding:'2px 12px 8px',gap:6}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:8,color:'#94a3b8',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'monospace'}}>ODDS</span>
          <span style={{fontSize:9,fontFamily:'monospace',color:'#16a34a',fontWeight:700}}>1 {odds[0].toFixed(2)}</span>
          <span style={{fontSize:9,fontFamily:'monospace',color:'#64748b',fontWeight:700}}>X {odds[1].toFixed(2)}</span>
          <span style={{fontSize:9,fontFamily:'monospace',color:'#dc2626',fontWeight:700}}>2 {odds[2].toFixed(2)}</span>
        </div>
        <div style={{fontSize:8,color:'#94a3b8',fontFamily:'monospace',textAlign:'right'}}>{fixture.venue}</div>
      </div>
      {expanded&&hasInput&&<Breakdown rating={rating} fixture={fixture}/>}
      {expanded&&!hasInput&&<div style={{padding:'12px 16px',background:'#f8fafc',borderTop:'1px solid #e2e8f0',fontSize:11,color:'#94a3b8',textAlign:'center'}}>Enter a score above to see the breakdown</div>}
    </div>
  );
}

function GroupView({group,picks,onPick}){
  const fixtures=FIXTURES.filter(f=>f.g===group);
  const teams=[...new Set(fixtures.flatMap(f=>[f.home,f.away]))];
  const picked=fixtures.filter(f=>picks[f.id]?.h!=null).length;
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div>
          <div style={{fontSize:20,fontWeight:900,color:'#0f172a',fontFamily:'serif'}}>Group {group}</div>
          <div style={{fontSize:10,color:'#64748b',marginTop:2}}>{teams.map(t=>`${T[t]?.f} ${t}`).join(' · ')}</div>
        </div>
        <div style={{fontSize:11,color:'#64748b',fontFamily:'monospace'}}>{picked}/6</div>
      </div>
      {fixtures.map(f=><FixtureRow key={f.id} fixture={f} pick={picks[f.id]} onPick={pick=>onPick(f.id,pick)}/>)}
    </div>
  );
}

function SummaryView({picks}){
  const rated=useMemo(()=>FIXTURES.filter(f=>picks[f.id]?.h!=null).map(f=>{const p=picks[f.id];const r=rateScore(f,p.h,p.a);return{fixture:f,pick:p,rating:r};}),[picks]);
  const stats=useMemo(()=>{
    if(!rated.length)return null;
    const scores=rated.map(r=>r.rating.total);
    const avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
    const draws=rated.filter(r=>r.pick.h===r.pick.a).length;
    const drawPct=Math.round((draws/rated.length)*100);
    const highContrarian=rated.filter(r=>r.rating.pe>=12).length;
    const sharp=rated.filter(r=>r.rating.total>=75).length;
    const risky=rated.filter(r=>r.rating.total<45).length;
    const oneZero=rated.filter(r=>(r.pick.h===1&&r.pick.a===0)||(r.pick.h===0&&r.pick.a===1)).length;
    return{avg,draws,drawPct,highContrarian,sharp,risky,oneZero,total:rated.length};
  },[rated]);
  const distData=useMemo(()=>{
    const bins=[{range:'0-39',label:'Risky',color:'#ef4444',count:0},{range:'40-54',label:'Weak',color:'#f97316',count:0},{range:'55-67',label:'Fair',color:'#eab308',count:0},{range:'68-81',label:'Good',color:'#22c55e',count:0},{range:'82-100',label:'Sharp',color:'#15b26b',count:0}];
    rated.forEach(r=>{const s=r.rating.total;if(s<40)bins[0].count++;else if(s<55)bins[1].count++;else if(s<68)bins[2].count++;else if(s<82)bins[3].count++;else bins[4].count++;});
    return bins;
  },[rated]);
  const topPicks=useMemo(()=>[...rated].sort((a,b)=>b.rating.total-a.rating.total).slice(0,5),[rated]);
  const riskyPicks=useMemo(()=>[...rated].sort((a,b)=>a.rating.total-b.rating.total).slice(0,3),[rated]);
  if(!rated.length)return(<div style={{textAlign:'center',padding:'60px 20px',color:'#94a3b8'}}><Trophy size={40} style={{margin:'0 auto 14px',opacity:0.4}}/><div style={{fontSize:16,fontWeight:700,color:'#64748b'}}>No picks yet</div><div style={{fontSize:12,marginTop:6}}>Head to any group tab to start entering your scores</div></div>);
  return(
    <div>
      <div style={{fontSize:20,fontWeight:900,color:'#0f172a',fontFamily:'serif',marginBottom:4}}>Portfolio Overview</div>
      <div style={{fontSize:11,color:'#64748b',marginBottom:18}}>{stats.total} of 72 picks entered</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20}}>
        {[{label:'Avg Rating',val:stats.avg,color:ratingColor(stats.avg),suffix:'/100'},{label:'Sharp Picks',val:stats.sharp,color:'#15b26b',suffix:''},{label:'Risky Picks',val:stats.risky,color:'#ef4444',suffix:''},{label:'Contrarian',val:stats.highContrarian,color:'#6366f1',suffix:''}].map(k=>(
          <div key={k.label} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:'12px 14px'}}>
            <div style={{fontSize:22,fontWeight:900,color:k.color,fontFamily:'monospace',lineHeight:1}}>{k.val}{k.suffix}</div>
            <div style={{fontSize:9,color:'#64748b',marginTop:5,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase'}}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:16,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:'#334155',marginBottom:12}}>Rating Distribution</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={distData} barSize={36}>
            <XAxis dataKey="label" tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip formatter={(v)=>[`${v} picks`,'Count']} contentStyle={{fontSize:11,borderRadius:6}}/>
            <Bar dataKey="count" radius={[4,4,0,0]}>{distData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:14}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#64748b',marginBottom:8}}>Pool Health Checks</div>
          {[{ok:stats.drawPct>=12&&stats.drawPct<=25,msg:`Draws: ${stats.draws}/${stats.total} (${stats.drawPct}%)`,hint:'Target 15-22%. Historical WC draw rate ~17%.'},{ok:stats.oneZero<=Math.round(stats.total*0.22),msg:`1-0 / 0-1 picks: ${stats.oneZero}`,hint:"Most common result (~19%) but don't over-rely."},{ok:stats.highContrarian>=Math.round(stats.total*0.25),msg:`Contrarian picks: ${stats.highContrarian}`,hint:'Aim for 25%+ to unlock bonus point potential.'}].map((w,i)=>(
            <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
              {w.ok?<CheckCircle2 size={14} style={{color:'#22c55e',flexShrink:0,marginTop:1}}/>:<AlertCircle size={14} style={{color:'#f97316',flexShrink:0,marginTop:1}}/>}
              <div><div style={{fontSize:11,fontWeight:700,color:'#334155'}}>{w.msg}</div><div style={{fontSize:10,color:'#64748b',marginTop:1}}>{w.hint}</div></div>
            </div>
          ))}
        </div>
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:14}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#64748b',marginBottom:8}}>Sharpest Picks</div>
          {topPicks.map(r=>(
            <div key={r.fixture.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,paddingBottom:6,borderBottom:'1px solid #f1f5f9'}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'#0f172a'}}>{T[r.fixture.home]?.f} {r.fixture.home} {r.pick.h}–{r.pick.a} {T[r.fixture.away]?.f} {r.fixture.away}</div>
                <div style={{fontSize:9,color:'#64748b',fontFamily:'monospace'}}>Group {r.fixture.g} · MD{r.fixture.md}</div>
              </div>
              <div style={{fontSize:13,fontWeight:900,color:ratingColor(r.rating.total),fontFamily:'monospace'}}>{r.rating.total}</div>
            </div>
          ))}
          {riskyPicks.length>0&&(<>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#ef4444',marginTop:12,marginBottom:8}}>⚠️ Reconsider</div>
            {riskyPicks.map(r=>(<div key={r.fixture.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}><div style={{fontSize:10,fontWeight:600,color:'#334155'}}>{T[r.fixture.home]?.f} {r.fixture.home} {r.pick.h}–{r.pick.a} {T[r.fixture.away]?.f} {r.fixture.away}</div><div style={{fontSize:13,fontWeight:900,color:'#ef4444',fontFamily:'monospace'}}>{r.rating.total}</div></div>))}
          </>)}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [picks,setPicks]=useState({});
  const [activeGroup,setActiveGroup]=useState('A');
  const [activeTab,setActiveTab]=useState('groups');
  const [saved,setSaved]=useState(false);
  const [storageLoaded,setStorageLoaded]=useState(false);

  useEffect(()=>{
    const init={};
    FIXTURES.forEach(f=>{init[f.id]={h:0,a:0};});
    try{
      const stored=localStorage.getItem('wc26-picks');
      if(stored){ setPicks({...init,...JSON.parse(stored)}); }
      else{ setPicks(init); }
    }catch{ setPicks(init); }
    setStorageLoaded(true);
  },[]);

  const savePicks=useCallback((newPicks)=>{
    try{ localStorage.setItem('wc26-picks',JSON.stringify(newPicks)); setSaved(true); setTimeout(()=>setSaved(false),1500); }catch{}
  },[]);

  const handlePick=useCallback((id,pick)=>{
    setPicks(prev=>{ const next={...prev,[id]:pick}; savePicks(next); return next; });
  },[savePicks]);

  const handleReset=()=>{ const init={}; FIXTURES.forEach(f=>{init[f.id]={h:0,a:0};}); setPicks(init); savePicks(init); };

  const progress=useMemo(()=>{
    if(!storageLoaded)return{done:0,avg:null};
    const rated=FIXTURES.filter(f=>picks[f.id]!=null).map(f=>rateScore(f,picks[f.id]?.h,picks[f.id]?.a));
    const scores=rated.filter(Boolean).map(r=>r.total);
    return{done:rated.length,avg:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null};
  },[picks,storageLoaded]);

  if(!storageLoaded)return(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f8fafc'}}><div style={{fontSize:13,color:'#64748b'}}>Loading...</div></div>);

  return(
    <div style={{minHeight:'100vh',background:'#f1f5f9',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
      <div style={{background:'#0a1a2f',padding:'0 16px'}}>
        <div style={{maxWidth:860,margin:'0 auto',paddingTop:14,paddingBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontSize:8,letterSpacing:'3px',color:'#15b26b',fontWeight:800,textTransform:'uppercase',fontFamily:'monospace',marginBottom:3}}>FIFA WORLD CUP 2026 · PREDICTION POOL</div>
              <div style={{fontSize:22,fontWeight:900,color:'#f5f1e8',fontFamily:'serif',lineHeight:1}}>The Score Grader</div>
              <div style={{fontSize:10,color:'rgba(245,241,232,0.6)',marginTop:4}}>Rate every pick. Find your edge. Bank the €400.</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
              <div style={{display:'flex',gap:16}}>
                <div style={{textAlign:'right'}}><div style={{fontSize:18,fontWeight:900,color:'#f5f1e8',fontFamily:'monospace',lineHeight:1}}>{progress.done}/72</div><div style={{fontSize:8,letterSpacing:'1px',color:'rgba(245,241,232,0.5)',textTransform:'uppercase'}}>Fixtures</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:18,fontWeight:900,color:progress.avg?ratingColor(progress.avg):'#475569',fontFamily:'monospace',lineHeight:1}}>{progress.avg??'—'}</div><div style={{fontSize:8,letterSpacing:'1px',color:'rgba(245,241,232,0.5)',textTransform:'uppercase'}}>Avg Rating</div></div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {saved&&<span style={{fontSize:9,color:'#15b26b',fontFamily:'monospace',letterSpacing:'1px'}}>✓ SAVED</span>}
                <button onClick={handleReset} style={{background:'rgba(245,241,232,0.08)',border:'1px solid rgba(245,241,232,0.2)',borderRadius:4,padding:'4px 10px',color:'rgba(245,241,232,0.6)',fontSize:10,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><RefreshCw size={10}/> Reset</button>
              </div>
            </div>
          </div>
          <div style={{height:3,background:'rgba(245,241,232,0.1)',borderRadius:2,marginTop:12,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(progress.done/72)*100}%`,background:'#15b26b',borderRadius:2,transition:'width 0.3s'}}/>
          </div>
        </div>
      </div>
      <div style={{background:'#0f2744',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{maxWidth:860,margin:'0 auto',display:'flex',overflowX:'auto',padding:'0 16px'}}>
          <button onClick={()=>setActiveTab('summary')} style={{padding:'9px 14px',fontSize:11,fontWeight:700,cursor:'pointer',background:'none',border:'none',borderBottom:activeTab==='summary'?'2px solid #15b26b':'2px solid transparent',color:activeTab==='summary'?'#15b26b':'rgba(245,241,232,0.6)',display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap',letterSpacing:'0.5px'}}>
            <TrendingUp size={11}/> Summary
          </button>
          {GROUPS.map(g=>{
            const grpPicks=FIXTURES.filter(f=>f.g===g&&picks[f.id]!=null);
            const grpRatings=grpPicks.map(f=>rateScore(f,picks[f.id].h,picks[f.id].a)).filter(Boolean);
            const avgR=grpRatings.length?Math.round(grpRatings.reduce((a,b)=>a+b.total,0)/grpRatings.length):null;
            return(
              <button key={g} onClick={()=>{setActiveTab('groups');setActiveGroup(g);}} style={{padding:'9px 10px',fontSize:11,fontWeight:700,cursor:'pointer',background:'none',border:'none',borderBottom:(activeTab==='groups'&&activeGroup===g)?'2px solid #15b26b':'2px solid transparent',color:(activeTab==='groups'&&activeGroup===g)?'#15b26b':'rgba(245,241,232,0.6)',display:'flex',flexDirection:'column',alignItems:'center',gap:2,whiteSpace:'nowrap'}}>
                <span style={{letterSpacing:'0.5px'}}>Grp {g}</span>
                {avgR&&<span style={{fontSize:8,fontFamily:'monospace',color:ratingColor(avgR),fontWeight:900}}>{avgR}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{maxWidth:860,margin:'0 auto',padding:'16px 16px 40px'}}>
        {activeTab==='groups'&&(
          <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:8,padding:'8px 12px',marginBottom:14,display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>
            <span style={{fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',color:'#64748b',fontWeight:700,fontFamily:'monospace'}}>Rating Scale</span>
            {[['<40','Risky','#ef4444'],['40-54','Weak','#f97316'],['55-67','Fair','#eab308'],['68-81','Good','#22c55e'],['82+','Sharp','#15b26b']].map(([r,l,c])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:9,height:9,borderRadius:'50%',background:c}}/><span style={{fontSize:10,color:'#334155',fontWeight:600}}>{l}</span><span style={{fontSize:9,color:'#94a3b8'}}>{r}</span></div>
            ))}
          </div>
        )}
        {activeTab==='summary'?<SummaryView picks={picks}/>:<GroupView group={activeGroup} picks={picks} onPick={handlePick}/>}
      </div>
      <div style={{background:'#0a1a2f',padding:'10px 16px'}}>
        <div style={{maxWidth:860,margin:'0 auto',fontSize:8,color:'rgba(245,241,232,0.4)',fontFamily:'monospace',letterSpacing:'0.5px',textAlign:'center'}}>
          RATING = Freq (35) + Matchday Fit (20) + Matchup Logic (30) + Pool Edge (15) · Data: 2002–2022 WC · Picks saved to localStorage
        </div>
      </div>
    </div>
  );
}
