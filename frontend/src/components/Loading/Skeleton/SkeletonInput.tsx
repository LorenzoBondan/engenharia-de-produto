import './styles.css';

type SkeletonInputProps = {
  width?: string;
  height?: string;
};

const SkeletonInput = ({ width = '100%', height = '40px' }: SkeletonInputProps) => {
  return (
    <div
      className="skeleton-input"
      style={{ width, height }}
    />
  );
};

export default SkeletonInput;
