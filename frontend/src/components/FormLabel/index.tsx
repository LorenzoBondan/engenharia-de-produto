import './styles.css';

type Props = {
    text: string;
    isRequired?: boolean;
}
  
export default function FormLabel({ text, isRequired = false }: Props) {
    return (
      <label className="form-label">
        {text}
        {isRequired && <span className="asterisk">*</span>}
      </label>
    );
}
  