import './styles.css';

type Props = {
  text: string;
};

export default function ButtonPrimary({ text }: Props) {
  return (
    <button className="btn btn-primary" type="submit">
      {text}
    </button>
  );
}
