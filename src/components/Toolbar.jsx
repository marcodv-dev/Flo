const BTN_STYLE = { width:48, height:48, borderRadius:'50%', cursor:'pointer', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', color:'#1F2937' }
const BTN_ACTIVE = { backgroundImage:'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 51%),radial-gradient(ellipse at center, #059669 0%, #06B6D4 100%)', color:'#fff' }
const GLASS = { border:'none', backgroundColor:'rgba(5,150,105,0.15)', backgroundImage:'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 51%),radial-gradient(ellipse at center, rgba(5,150,105,0.3) 0%, rgba(6,182,212,0.15) 100%)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', boxShadow:'inset 0 -3px 5px rgba(0,0,0,0.1), inset 0 3px 5px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.12)' }
const BTN_DISABLED = { opacity:0.3, pointerEvents:'none' }
const ICON = { width:16, height:16, display:'block', pointerEvents:'none' }

export default function Toolbar({ listActive, boldActive, saveDisabled, onList, onBold, onNewline, onTimestamp, onFinish }) {
  return (
    <div className="toolbar" style={{ background:'transparent' }}>
      <button style={{ ...BTN_STYLE, ...GLASS, ...(listActive ? BTN_ACTIVE : {}) }} onClick={onList} type="button" title="Punto lista"><img src="/list.png" alt="•" style={ICON} /></button>
      <button style={{ ...BTN_STYLE, ...GLASS, ...(boldActive ? BTN_ACTIVE : {}) }} onClick={onBold} type="button" title="Grassetto"><img src="/bold-text.png" alt="B" style={ICON} /></button>
      <button style={{ ...BTN_STYLE, ...GLASS }} onClick={onNewline} type="button" title="A capo"><img src="/down-left.png" alt="↵" style={ICON} /></button>
      <button style={{ ...BTN_STYLE, ...GLASS }} onClick={onTimestamp} type="button" title="Ora"><img src="/clock.png" alt="⏱" style={ICON} /></button>
      <button style={{ ...BTN_STYLE, ...GLASS, ...(saveDisabled ? BTN_DISABLED : {}) }} onClick={saveDisabled ? undefined : onFinish} type="button" title="Fine"><img src="/tick.png" alt="✓" style={ICON} /></button>
    </div>
  )
}