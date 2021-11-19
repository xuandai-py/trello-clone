import './Card.scss';

const Card = (props) => {
    const {card} = props

    console.log(card.title);
    return (
        <li className="card-item">
            
            {card.cover && <img className="card-cover" src={card.cover} alt="photo" />}
            <p>{card.title}</p>
        </li>
    )
}

export default Card;