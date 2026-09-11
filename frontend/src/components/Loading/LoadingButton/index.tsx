import Spinner from '../Spinner';

type LoadingButtonProps = {
  loading: boolean;
  text: string;
  loadingText?: string;
  variant?: 'primary' | 'inverse';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const LoadingButton = ({
  loading,
  text,
  loadingText = 'Loading...',
  variant = 'primary',
  className = '',
  ...buttonProps
}: LoadingButtonProps) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-inverse';
  const displayText = loading ? loadingText : text;

  return (
    <button
      {...buttonProps}
      type={buttonProps.type || 'submit'}
      disabled={loading || buttonProps.disabled}
      aria-disabled={loading || buttonProps.disabled}
      className={`btn ${variantClass} ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      {loading && <Spinner size="small" aria-label="Loading" />}
      {displayText}
    </button>
  );
};

export default LoadingButton;
