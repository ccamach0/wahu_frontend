export default function WahuLogo({
  className = '',
  textColor = '#1a1a2e',
  size = 40,
  stacked = false,
  iconOnly = false,
}) {
  const icon = (
    <img
      src="/logo-wahu.png"
      alt="wahu"
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
  );

  if (iconOnly) return icon;

  const textStyle = {
    color: textColor,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: 1,
    userSelect: 'none',
  };

  if (stacked) {
    return (
      <div
        className={`flex flex-col items-center ${className}`}
        style={{ gap: Math.round(size * 0.1) }}
      >
        {icon}
        <span style={{ ...textStyle, fontSize: Math.round(size * 0.52) }}>wahu</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: Math.round(size * 0.18), height: size }}
    >
      {icon}
      <span style={{ ...textStyle, fontSize: Math.round(size * 0.65) }}>wahu</span>
    </div>
  );
}
