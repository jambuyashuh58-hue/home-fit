<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>HomeFit Solutions</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet0B1F3A;--blue:#1E88E5;--gray:#F3F5F7;--lime:#A3E635}
    *{box-sizing:border-box} html,body{margin:0;background:#fff;color:var(--navy);font-family:'Lato','Helvetica Neue',sans-serif}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} .spin{animation:spin 1s linear infinite}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    .container{max-width:1200px;margin:0 auto;padding:0 24px}
    .btn{display:inline-flex;align-items:center;gap:8px;font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:.2s}
    .btn-lg{padding:16px 32px;font-size:16px} .btn-md{padding:12px 24px;font-size:14px} .btn-sm{padding:8px 16px;font-size:13px}
    .btn-primary{background:linear-gradient(135deg,var(--blue),#1565C0);color:#fff;box-shadow:0 4px 15px #1E88E540}
    .btn-outline{background:transparent;color:#fff;border:2px solid #ffffff40}
    .btn-lime{background:linear-gradient(135deg,var(--lime),#84CC16);color:var(--navy);box-shadow:0 4px 15px #A3E63540}
    .card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 20px rgba(0,0,0,.04)}
    .badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px}
    .toast{position:fixed;bottom:80px;right:24px;z-index:9999;color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.2);display:flex;align-items:center;gap:10px;animation:slideUp .3s ease}
    header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);border-bottom:1px solid #E2E8F020}
    .qty{display:flex;align-items:center;gap:2px;background:#F1F5F9;border-radius:8px;padding:2px}
    .qty button{width:28px;height:28px;border-radius:6px;border:none;font-weight:800;cursor:pointer}
    .grid{display:grid;gap:24px}
    @media (max-width:768px){.hide-sm{display:none!important}}
  </style>
  <!-- React + ReactDOM + Babel -->
  <script src="https://unpkg.com/react@18/umd/reactjs</script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"cript src="https://unpkg.com/@babel/standalone/babelpt>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const CL={navy:"#0B1F3A",blue:"#1E88E5",gray:"#F3F5F7",lime:"#A3E635"};
    const rup=n=>"₹"+(Number(n)||0).toLocaleString("en-IN");
    const gC=(k,d)=>{try{if(typeof window==="undefined")return d;const r=sessionStorage.getItem(k);return r?{...d,...JSON.parse(r)}:d;}catch{return d}};
    const sC=(k,v)=>{try{if(typeof window==="undefined")return;sessionStorage.setItem(k,JSON.stringify(v));}catch{}};

    function loadRzp(){return new Promise(res=>{if(typeof window==="undefined")return res(false);if(window.Razorpay)return res(true);const s=document.createElement("script");s.src="https://checkout.razorpay.com/v1/checkout.js";s.async=true;s.onload=()=>res(true);s.onerror=()=>res(false);document.body.appendChild(s);});}
    async function openRzp({keyId,amount,desc,notes,prefill,onOk,onFail}){if(typeof window==="undefined")return;const ok=await loadRzp();if(!ok||!window.Razorpay){alert("Razorpay failed to load");return;}new window.Razorpay({key:keyId,amount:Math.round((amount||0)*100),currency:"INR",name:"HomeFit Solutions",description:desc||"Payment",notes:notes||{},prefill:prefill||{},theme:{color:CL.blue},handler:r=>onOk?.({pid:r.razorpay_payment_id,oid:r.razorpay_order_id,sig:r.razorpay_signature}),modal:{ondismiss:()=>onFail?.("dismissed")}}).open();}

    const ALL_ITEMS=[
      {id:"modular-kitchen-basic",name:"Modular Kitchen (Below Platform)",cat:"Kitchen",price:40000},
      {id:"modular-kitchen-premium",name:"Modular Kitchen + Crockery Unit",cat:"Kitchen",price:60000},
      {id:"modular-kitchen-luxury",name:"Modular Kitchen Full (Platform + Crockery + Chimney + Storage + Top Floor Box)",cat:"Kitchen",price:115000},
      {id:"double-bed",name:"Double Bed",cat:"Bedroom",price:30000},
      {id:"mattress",name:"Mattress",cat:"Bedroom",price:10000},
      {id:"wardrobe-sliding",name:"Wardrobe (Sliding)",cat:"Bedroom",price:75000},
      {id:"tv-unit",name:"TV Unit",cat:"Living Room",price:30000},
      {id:"sofa-lshape",name:"Sofa L-Shape",cat:"Living Room",price:30000},
      {id:"false-ceiling",name:"False Ceiling",cat:"Finishing",price:25000},
      {id:"painting",name:"Painting",cat:"Finishing",price:60000},
    ];
    const TIER_PRESETS={
      "Basic — 1BHK":{color:"#6366F1",price:"₹1,77,000",items:[{id:"modular-kitchen-basic",qty:1},{id:"double-bed",qty:1},{id:"mattress",qty:1},{id:"tv-unit",qty:1}]},
      "Premium — 2BHK":{color:"#1E88E5",price:"₹4,65,000",items:[{id:"modular-kitchen-premium",qty:1},{id:"double-bed",qty:2},{id:"mattress",qty:2},{id:"wardrobe-sliding",qty:2},{id:"sofa-lshape",qty:1}]},
      "Luxury — 3BHK":{color:CL.lime,price:"₹7,05,000",items:[{id:"modular-kitchen-luxury",qty:1},{id:"double-bed",qty:2},{id:"mattress",qty:2},{id:"wardrobe-sliding",qty:2},{id:"painting",qty:1},{id:"false-ceiling",qty:1}]}
    };
    const TIER_KEYS=Object.keys(TIER_PRESETS);

    const Badge=({children,color=CL.blue,style})=><span className="badge" style={{background:color+"18",color,...style}}>{children}</span>;
    const Btn=({children,variant="primary",size="md",onClick,style={},disabled,loading})=>{
      const base="btn "+(size==="lg"?"btn-lg":size==="sm"?"btn-sm":"btn-md");
      const cls=variant==="primary"?"btn-primary":variant==="lime"?"btn-lime":"btn-outline";
      return <button onClick={onClick} disabled={disabled||loading} className={`${base} ${cls}`} style={{opacity:(disabled||loading)?.6:1,...style}}>{loading?"⏳":null}{children}</button>;
    };
    const Card=({children,style,onClick})=><div className="card" style={{cursor:onClick?"pointer":"default",...style}} onClick={onClick}>{children}</div>;
    const Inp=({label,type="text",value,onChange,placeholder,required,multiline,rows=3})=>(
      <div style={{marginBottom:16}}>
        {label&&<label style={{display:"block",marginBottom:6,fontSize:13,fontWeight:700,color:CL.navy,fontFamily:"'Poppins',sans-serif"}}>{label}{required&&<span style={{color:"#EF4444"}}> *</span>}</label>}
        {multiline?
          <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1.5px solid #E2E8F0",fontSize:14,background:"#FAFBFC",outline:"none"}}/>:
          <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} required={required}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1.5px solid #E2E8F0",fontSize:14,background:"#FAFBFC",outline:"none"}}/>}
      </div>
    );
    const Qty=({qty,onChange,min=0,max=10})=>(
      <div className="qty">
        <button onClick={()=>onChange(Math.max(min,qty-1))} style={{background:qty<=min?"#E2E8F0":CL.blue,color:qty<=min?"#94A3B8":"#fff"}}>-</button>
        <span style={{width:32;textAlign:"center",fontWeight:800}}>{qty}</span>
        <button onClick={()=>onChange(Math.min(max,qty+1))} style={{background:CL.blue,color:"#fff"}}>+</button>
      </div>
    );

    const Ctx=React.createContext(null);

    const ConnBar=({rk,onCfg})=>(
      <div style={{background:"#FEF3C7",padding:"6px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:16,fontSize:12,fontWeight:700,flexWrap:"wrap"}}>
        <span style={{color:"#92400E"}}>○ Supabase Demo</span>
        <span style={{color:"#CBD5E1"}}>|</span>
        <span style={{color:rk?"#10B981":"#92400E"}}>{rk?"● Razorpay Ready":"○ Razorpay Not set"}</span>
        <button className="btn btn-sm" style="background:#0B1F3A;color:#fff;border-radius:8px" onclick="return false" onClick={onCfg}>⚙ Configure</button>
      </div>
    );

    const Modal=({show,onClose,title,children})=>{
      if(!show) return null;
      return (
        <div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:32,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 60px rgba(0,0,0,.3)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,color:CL.navy,margin:0,fontSize:20}}>{title}</h2>
              <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer"}}>✕</button>
            </div>
            {children}
          </div>
        </div>
      );
    };

    const SetupModal=({show,onClose,rc,setRc,onSave})=>(
      <Modal show={show} onClose={onClose} title="🔌 Connect Services">
        <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:16,marginBottom:24,fontSize:13,color:"#166534",lineHeight:1.7}}>
          Optional: Add your Razorpay Key ID to enable live checkout.
        </div>
        <Inp label="Razorpay Key ID" value={rc.keyId} onChange={v=>setRc(p=>({...p,keyId:v}))} placeholder="rzp_test_xxxxxxxxxxxx"/>
        <div style={{display:"flex",gap:12,marginTop:20}}>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="lime" onClick={onSave} style={{flex:1,justifyContent:"center"}}>Save & Connect</Btn>
        </div>
      </Modal>
    );

    const Header=()=>{
      const {page,go}=React.useContext(Ctx);
      return (
        <header>
          <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
            <div onClick={()=>go("home")} style={{cursor:"pointer",fontFamily:"'Poppins',sans-serif",fontWeight:800}}>🏠 HomeFit <span style={{color:CL.blue}}>Solutions</span></div>
            <nav className="hide-sm" style={{display:"flex",alignItems:"center",gap:8}}>
              {[
                ["Packages","packages"],
                ["Gallery","gallery"],
                ["Contact","contact"]
              ].map(([l,k])=>
                <button key={k} onClick={()=>go(k)} style={{padding:"8px 14px",background:"none",border:"none",color:page===k?CL.blue:CL.navy,fontWeight:700,cursor:"pointer"}}>{l}</button>
              )}
              <Btn variant="lime" size="sm" onClick={()=>go("builder")}>Get Quotation</Btn>
            </nav>
          </div>
        </header>
      );
    };

    const Hero=()=>{
      const {go}=React.useContext(Ctx);
      return (
        <section style={{position:"relative",overflow:"hidden",background:`linear-gradient(165deg,${CL.navy} 0%,#0D2847 50%,#132F55 100%)`,padding:"80px 24px 100px",minHeight:420}}>
          <div className="container">
            <span className="badge" style={{background:CL.lime+"30",color:CL.lime}}>Trusted by 50+ Builders Across India</span>
            <h1 style={{fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:800,color:"#fff",lineHeight:1.08,margin:"20px 0 16px"}}>
              From Shell to <span style={{background:`linear-gradient(135deg,${CL.lime},#84CC16)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Sell‑Ready</span>
            </h1>
            <p style={{fontSize:18,color:"#94A3B8",maxWidth:560,lineHeight:1.7,margin:"0 0 32px"}}>Complete home fitout packages — furniture, kitchen, electrical & finishing. Pick exactly what you need, see your price instantly.</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Btn variant="lime" size="lg" onClick={()=>go("builder")}>Build Your Package</Btn>
              <Btn variant="outline" size="lg" onClick={()=>go("contact")}>Contact Us</Btn>
            </div>
          </div>
        </section>
      );
    };

    const Builder=()=>{
      const {rk,toast}=React.useContext(Ctx);
      const [step,setStep]=React.useState(1);
      const [tier,setTier]=React.useState("");
      const [items,setItems]=React.useState({});
      const [quot,setQuot]=React.useState(null);
      const [saving,setSaving]=React.useState(false);
      const [paying,setPaying]=React.useState(false);
      const [copied,setCopied]=React.useState(false);
      const [units,setUnits]=React.useState(1);

      const loadTier=tk=>{setTier(tk);const map={};(TIER_PRESETS[tk]?.items||[]).forEach(({id,qty})=>map[id]=qty);setItems(map);setStep(2);};
      const toggleItem=id=>setItems(p=>{const n={...p};if(n[id])delete n[id];else n[id]=1;return n;});
      const setQty=(id,q)=>setItems(p=>{const n={...p};if(q<=0)delete n[id];else n[id]=q;return n;});

      const selected=Object.entries(items).map(([id,qty])=>({...ALL_ITEMS.find(a=>a.id===id),qty})).filter(i=>i?.id);
      const perUnit=selected.reduce((s,i)=>s+i.price*i.qty,0);
      const total=perUnit*units, booking=Math.round(total*.10), mid=Math.round(total*.50), final_=total-booking-mid;

      const generate=async()=>{setSaving(true);try{setQuot({id:"demo-"+Date.now(),public_token:"demo_"+Date.now(),tier:tier||"Custom",items:selected,total});toast("Quotation generated (demo)","info");}catch(e){toast(e.message,"error")}setSaving(false);};

      const pay=async()=>{if(!rk){toast("Configure Razorpay first!","error");return;}setPaying(true);openRzp({keyId:rk,amount:booking,desc:`10% Booking — ${tier||"Custom"} × ${units} units`,notes:{tier,units},onOk:()=>{toast("Payment successful!","success");setPaying(false)},onFail:()=>{toast("Payment failed","error");setPaying(false)}});};

      if(quot){
        const origin=(typeof window!=="undefined"&&window.location?.origin)?window.location.origin:"";
        const publicUrl=quot?.public_token?`${origin}/q/${quot.public_token}`:"";
        const copy=async()=>{try{if(navigator?.clipboard&&publicUrl){await navigator.clipboard.writeText(publicUrl);setCopied(true);setTimeout(()=>setCopied(false),2000);}else toast("Clipboard not available","error");}catch{toast("Copy failed","error");}};
        return (
          <section style={{padding:"80px 24px"}}>
            <div className="container" style={{maxWidth:740}}>
              <Card style={{padding:40}}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:80,height:80,borderRadius:"50%",background:"#10B98120",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>✅</div>
                  <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,margin:0}}>Quotation Ready!</h2>
                  <p style={{color:"#94A3B8",fontSize:12}}>{quot.public_token}</p>
                </div>
                <div style={{background:CL.gray,borderRadius:12,padding:24,margin:"24px 0"}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#64748B",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Itemized (per unit)</div>
                  {selected.map(i=>(
                    <div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:14,borderBottom:"1px solid #E2E8F0"}}>
                      <span style={{color:"#334155"}}>{i.name}{i.qty>1?` × ${i.qty}`:""}</span>
                      <span style={{fontWeight:800}}>{rup(i.price*i.qty)}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,borderTop:"2px solid #CBD5E1",marginTop:8,fontWeight:800}}>
                    <span>Per Unit Total</span><span style={{color:CL.blue}}>{rup(perUnit)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,marginTop:12,borderTop:"2px solid #1E293B",fontSize:22}}>
                    <span style={{fontWeight:800}}>Grand Total</span><span style={{fontWeight:800,color:CL.blue}}>{rup(total)}</span>
                  </div>
                </div>
                <div style={{background:"#EFF6FF",borderRadius:12,padding:20,marginBottom:24}}>
                  {[
                    {l:"10% — Order Booking (pay now)",a:booking,active:true},
                    {l:"50% — Within 30 days",a:mid},
                    {l:"40% — Before Finishing",a:final_}
                  ].map((p,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?"1px solid #BFDBFE":"none",fontSize:14}}>
                      <span style={{color:p.active?CL.blue:"#64748B",fontWeight:p.active?800:400}}>{p.l}</span>
                      <span style={{fontWeight:800,color:p.active?CL.blue:CL.navy}}>{rup(p.a)}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                  <Btn variant="lime" size="lg" onClick={pay} loading={paying}>Pay Booking {rup(booking)}</Btn>
                  <Btn variant="outline" onClick={copy}>{copied?"Copied!":"Copy Link"}</Btn>
                  <Btn variant="outline" onClick={()=>{setQuot(null);setStep(1);setTier("");setItems({});setUnits(1);}}>New Quote</Btn>
                </div>
              </Card>
            </div>
          </section>
        );
      }

      return (
        <section style={{padding:"60px 24px",background:CL.gray}}>
          <div className="container" style={{maxWidth:900}}>
            <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800}}>Package Builder</h2>

            {step===1&&(
              <div>
                {Object.keys(TIER_PRESETS).map((tk,i)=>{
                  const t=TIER_PRESETS[tk];
                  return (
                    <Card key={tk} onClick={()=>loadTier(tk)} style={{display:"flex",alignItems:"center",gap:20,marginBottom:12,border:"2px solid #E2E8F0"}}>
                      <div style={{width:64,height:64,borderRadius:14,background:(t.color||CL.blue)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{["🏠","🏢","🏰"][i]}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800}}>{tk}</div>
                        <div style={{fontSize:13,color:"#64748B"}}>Preset — {t.items.length} items included</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:20,fontWeight:800,color:CL.blue}}>{t.price}</div>
                        <div style={{fontSize:12,color:"#94A3B8"}}>per unit</div>
                      </div>
                    </Card>
                  );
                })}
                <div style={{textAlign:"center",margin:"20px 0"}}>
                  <div style={{color:"#94A3B8",fontSize:13,marginBottom:12}}>— or —</div>
                  <Btn variant="outline" onClick={()=>{setTier("Custom");setItems({});setStep(2);}}>Start From Scratch</Btn>
                </div>
              </div>
            )}

            {step===2&&(
              <>
                <div style={{position:"sticky",top:64,zIndex:10,background:CL.navy,borderRadius:12,padding:"16px 24px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",color:"#fff"}}>
                  <div>
                    <div style={{fontSize:12,color:"#94A3B8"}}>Selected: {Object.keys(items).length} items</div>
                    <div style={{fontSize:22,fontWeight:800}}>
                      {rup(Object.entries(items).reduce((s,[id,q])=>{const it=ALL_ITEMS.find(a=>a.id===id);return s+(it?it.price*q:0)},0))} <span style={{fontSize:13,fontWeight:400,color:"#94A3B8"}}>/ unit</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{color:"#94A3B8",fontSize:13}}>Units:</div>
                    <Qty qty={units} onChange={setUnits} min={1} max={500}/>
                    <div style={{borderLeft:"1px solid #334155",paddingLeft:12,marginLeft:4}}>
                      <div style={{fontSize:12,color:"#94A3B8"}}>Total</div>
                      <div style={{fontSize:16,fontWeight:800,color:CL.lime}}>
                        {rup(Object.entries(items).reduce((s,[id,q])=>{const it=ALL_ITEMS.find(a=>a.id===id);return s+(it?it.price*q:0)},0)*units)}
                      </div>
                    </div>
                  </div>
                </div>

                {["Kitchen","Bedroom","Living Room","Finishing"].map(cat=>(
                  <div key={cat} style={{marginBottom:24}}>
                    <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,margin:"0 0 12px",fontSize:15,display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:4,height:20,borderRadius:2,background:CL.blue}}></div>{cat}
                    </h3>
                    <div className="grid" style={{gap:8}}>
                      {ALL_ITEMS.filter(i=>i.cat===cat).map(item=>{
                        const active=items[item.id]>0; const qty=items[item.id]||0;
                        return (
                          <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderRadius:12,background:active?"#fff":"#FAFBFC",border:active?`2px solid ${CL.blue}`:"1.5px solid #E2E8F0",cursor:"pointer"}} onClick={()=>{if(!active)toggleItem(item.id);}}>
                            <input type="checkbox" checked={active} onChange={()=>toggleItem(item.id)} onClick={e=>e.stopPropagation()} style={{width:18,height:18,accentColor:CL.blue,cursor:"pointer"}}/>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700,color:active?CL.navy:"#64748B",fontSize:14}}>{item.name}</div>
                            </div>
                            <div style={{fontWeight:800,color:active?CL.blue:"#94A3B8",fontSize:14,marginRight:8}}>{rup(item.price)}</div>
                            {active&&<div onClick={e=>e.stopPropagation()}><Qty qty={qty} onChange={q=>setQty(item.id,q)} min={0} max={10}/></div>}
                            {active&&qty>1&&<div style={{fontSize:12,fontWeight:800,color:CL.navy,minWidth:70,textAlign:"right"}}>{rup(item.price*qty)}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div style={{display:"flex",gap:8,marginTop:24}}>
                  <Btn variant="outline" onClick={()=>setStep(1)}>← Back</Btn>
                  <Btn variant="primary" onClick={()=>setStep(3)} style={{flex:1,justifyContent:"center"}} disabled={Object.keys(items).length===0}>Review Summary →</Btn>
                </div>
              </>
            )}

            {step===3&&(
              <Card style={{padding:32}}>
                <h3 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,margin:"0 0 20px"}}>Order Summary</h3>
                <div style={{background:CL.gray,borderRadius:12,padding:20,marginBottom:20}}>
                  {Object.entries(items).map(([id,qty])=>{const i=ALL_ITEMS.find(a=>a.id===id);return (
                    <div key={id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:14,borderBottom:"1px solid #E2E8F0"}}>
                      <span style={{color:"#334155"}}>{i?.name}{qty>1?` × ${qty}`:""}</span>
                      <span style={{fontWeight:800,color:CL.navy}}>{rup((i?.price||0)*qty)}</span>
                    </div>
                  )})}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:8,fontSize:15,fontWeight:800,borderTop:"2px solid #CBD5E1"}}>
                    <span>Per Unit</span>
                    <span style={{color:CL.blue}}>{
                      rup(Object.entries(items).reduce((s,[id,q])=>{const it=ALL_ITEMS.find(a=>a.id===id);return s+(it?it.price*q:0)},0))
                    }</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn variant="outline" onClick={()=>setStep(2)}>← Edit Items</Btn>
                  <Btn variant="lime" onClick={()=>setQuot({id:"demo-"+Date.now(),public_token:"demo_"+Date.now()})} loading={false} style={{flex:1,justifyContent:"center"}}>Generate Quotation</Btn>
                </div>
              </Card>
            )}
          </div>
        </section>
      );
    };

    const Contact=()=>(
      <section style={{padding:"80px 24px"}}>
        <div className="container">
          <h2 style={{fontFamily:"'Poppins',sans-serif",fontWeight:800}}>Contact Us</h2>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:32}}>
            <Card>
              <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:"1px solid #F1F5F9"}}>📞 <div><div style={{fontWeight:800}}>Phone</div><div>+91 98765 43210</div></div></div>
              <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0"}}>✉️ <div><div style={{fontWeight:800}}>Email</div><div>hello@homefitsolutions.in</div></div></div>
            </Card>
            <Card>
              <Inp label="Name" value={""} onChange={()=>{}} required/>
              <Inp label="Email" type="email" value={""} onChange={()=>{}} required/>
              <Inp label="Message" value={""} onChange={()=>{}} multiline required/>
              <Btn variant="primary" style={{width:"100%",justifyContent:"center"}}>Send</Btn>
            </Card>
          </div>
        </div>
      </section>
    );

    const Toast=({id,message,type="success",onClose})=>{
      React.useEffect(()=>{const t=setTimeout(onClose,4000);return()=>clearTimeout(t);},[]);
      const bg=type==="success"?"#10B981":type==="error"?"#EF4444":CL.blue;
      return <div className="toast" style={{background:bg}}>{message}<button onClick={onClose} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",marginLeft:8}}>✕</button></div>;
    };

    function App(){
      const [page,setPage]=React.useState("home");
      const [showSetup,setShowSetup]=React.useState(false);
      const [toasts,setToasts]=React.useState([]);
      const [rc,setRc]=React.useState(()=>gC("hf_r",{keyId:""}));
      const toast=React.useCallback((m,t="success")=>setToasts(p=>[...p,{id:Date.now(),message:m,type:t}]),[]);
      const go=React.useCallback(p=>setPage(p),[]);
      const connect=()=>{sC("hf_r",rc);setShowSetup(false);if(rc.keyId)toast("Razorpay ready!","success");};

      return (
        <Ctx.Provider value={{page,go,rk:rc.keyId,toast}}>
          <ConnBar rk={rc.keyId} onCfg={()=>setShowSetup(true)}/>
          <Header/>
          <SetupModal show={showSetup} onClose={()=>setShowSetup(false)} rc={rc} setRc={setRc} onSave={connect}/>
          {page==="home"&&(<><Hero/><Builder/></>)}
          {page==="builder"&&<Builder/>}
          {page==="contact"&&<Contact/>}
          <footer style={{background:CL.navy,padding:"60px 24px 32px",color:"#94A3B8"}}>
            <div className="container">
              <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32,marginBottom:40}}>
                <div><div style={{fontFamily:"'Poppins',sans-serif",fontWeight:800,color:"#fff"}}>HomeFit Solutions</div><p style={{fontSize:14,lineHeight:1.7,marginTop:12,color:"#64748B"}}>Complete home fitout packages. Furniture, kitchen, electrical & finishing.</p></div>
                <div><div style={{fontWeight:800,color:"#fff",marginBottom:12,fontFamily:"'Poppins',sans-serif",fontSize:14}}>Contact</div><div style={{padding:"4px 0",fontSize:14}}>📞 +91 98765 43210</div><div style={{padding:"4px 0",fontSize:14}}>✉️ hello@homefitsolutions.in</div></div>
              </div>
              <div style={{borderTop:"1px solid #1E293B",paddingTop:24,textAlign:"center",fontSize:13}}>© 2026 HomeFit Solutions</div>
            </div>
          </footer>
          {toasts.map(t=><Toast key={t.id} {...t} onClose={()=>setToasts(p=>p.filter(x=>x.id!==t.id))}/>)}
        </Ctx.Provider>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
  </script>
</body>
</html>
