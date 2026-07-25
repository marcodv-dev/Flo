export default function LockOverlay({ visible }) {
  if (!visible) return null
  return (
    <div className="lock-overlay">
      <div className="lock-overlay-inner">
        <div className="lock-overlay-logo">Flō</div>
        <p className="lock-overlay-text">sessione bloccata</p>
      </div>
    </div>
  )
}