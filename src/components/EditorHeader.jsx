import { getNow } from '../utils/format'

export default function EditorHeader({ onList }) {
  return (
    <div className="header">
      <div className="header-left">
        <span className="header-logo">Flō</span>
        <span className="header-datetime">{getNow()}</span>
      </div>
      <button className="btn-glass header-btn" onClick={onList} type="button"><img src="/menu.png" alt="Lista" style={{width:16,height:16,display:'block',pointerEvents:'none'}} /></button>
    </div>
  )
}