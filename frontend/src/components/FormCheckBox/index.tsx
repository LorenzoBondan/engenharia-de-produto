import "./styles.css"; 

interface CustomCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormCheckbox({ id, name, label, checked, onChange }: CustomCheckboxProps) {
  return (
    <label className="checkbox-container">
      <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} />
      <div className="custom-checkbox"></div>
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
