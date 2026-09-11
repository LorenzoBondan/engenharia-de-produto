import './styles.css';

type AriaLiveRegionProps = {
  message: string;
  mode: 'polite' | 'assertive';
};

const AriaLiveRegion = ({ message, mode }: AriaLiveRegionProps) => {
  return (
    <div
      role="status"
      aria-live={mode}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export default AriaLiveRegion;
