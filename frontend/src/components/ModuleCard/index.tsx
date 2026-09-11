import './styles.css';

type Props = {
    title: string;
    imgUrl: string;
}

const ModuleCard = ({title, imgUrl} : Props) => {
    return(
        <div className='module-card-container base-card'>
            <div className='module-card-image-container'>
                <img src={imgUrl} alt="" />
            </div>
            <div className='module-card-content-container'>
                <h3>{title}</h3>
            </div>
        </div>
    );
}

export default ModuleCard;