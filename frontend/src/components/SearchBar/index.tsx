import './styles.css';
import { useSearchBar } from '../../hooks/common/useSearchBar';

type Props = {
    onSearch: Function;
}

export default function SearchBar({ onSearch }: Props) {

    const { text, handleChange, handleResetClick, handleSubmit } = useSearchBar(onSearch);

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <button type="submit">🔎︎</button>
            <input 
                value={text}
                type="text" 
                placeholder="" 
                onChange={handleChange}
            />
            <button onClick={handleResetClick}>🗙</button>
        </form>
    );
}
