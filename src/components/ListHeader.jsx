export default function ListHeader({ onNew }) {
  return (
    <div className="header">
      <div className="header-left">
        <span className="header-logo">Flō</span>
        <span className="header-title">I TUOI PENSIERI</span>
      </div>
      <button className="btn-glass header-btn" onClick={onNew} type="button"><img src="/plus.png" alt="+ Nuovo" style={{width:16,height:16,display:'block',pointerEvents:'none'}} /></button>
    </div>
  )
}