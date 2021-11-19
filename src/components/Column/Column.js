import Card from 'components/Card/Card';
import './Column.scss';
import { mapOrder } from 'utilities/sorts';

function Column(props) {
    const {column} = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    console.log(column.title);
    return (
        <>
            <div className="column">
                <header>{column.title}</header>
                <ul className="card-list">
                    {cards.map((card) => <Card key={card.id} card={card}/>)}

                </ul>
                <footer>Add another card</footer>
            </div>
           
        </>
    )
}

export default Column;