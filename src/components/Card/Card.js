import './Card.scss'
import React from 'react'

const Card = (props) => {
    const { card } = props
    return (
        <div className="card-item">
            {card.cover &&
                <img
                    className="card-cover"
                    src={card.cover}
                    alt="photo"
                    onMouseDown={e => e.preventDefault()}
                />
            }
            <p>{card.title}</p>
        </div>
    )
}

export default Card