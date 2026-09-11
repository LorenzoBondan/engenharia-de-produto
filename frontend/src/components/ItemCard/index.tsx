import './styles.css';
import { FiPaperclip } from "react-icons/fi";

type Props = {
    title: string;
};

const ItemCard = ({title} : Props) => {
    return(
        <div className='item-card-container card'>
            <div className='item-card-image-container'>
                <FiPaperclip/>
            </div>
            <div className='item-card-content-container'>
                <h5>{title}</h5>
            </div>
        </div>
    );
}

export default ItemCard;