import './styles.css';

type ProgressBarProps = {
  isAnimating: boolean;
};

const ProgressBar = ({ isAnimating }: ProgressBarProps) => {
  if (!isAnimating) return null;

  return (
    <div className="progress-bar" role="progressbar" aria-label="Loading page">
      <div className="progress-bar-fill" />
    </div>
  );
};

export default ProgressBar;
