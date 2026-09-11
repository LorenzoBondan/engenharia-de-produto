import './styles.css';

type SpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  'aria-label'?: string;
  className?: string;
};

const Spinner = ({
  size = 'medium',
  color,
  'aria-label': ariaLabel = 'Loading',
  className = '',
}: SpinnerProps) => {
  const sizeClass = `spinner-${size}`;

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`spinner ${sizeClass} ${className}`.trim()}
    >
      <div
        className="spinner-icon"
        style={color ? { borderTopColor: color } : undefined}
      />
    </div>
  );
};

export default Spinner;
