import './styles.css';

type Props = {
    text: string;
    onClick?: () => void;
}

export default function ButtonInverse({ text, onClick }: Props) {
    return (
        <div className="btn btn-white" onClick={onClick}>
            {text}
        </div>
    );
}
