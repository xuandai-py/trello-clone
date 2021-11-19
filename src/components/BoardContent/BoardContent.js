import Column from 'components/Column/Column';
import './BoardContent.scss';
import { initialData } from 'actions/initialData';
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { mapOrder } from 'utilities/sorts';

const BoardContent = () => {

    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        //const boardFromDB = initialData.boards.map((board) => {key: board.id, board})
        if (boardFromDB) {
            setBoard(boardFromDB);

            // sortColumns

            mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id')
            setColumns(boardFromDB.columns);
        }

    }, [])

    if (isEmpty(board)) {
        return (
            <div className="not-found">Board not found</div>
        )
    }

    console.log(columns[2].title);

    return (
        <div className="board-content">
            {columns.map((column) => 
                <Column key={column.id} column={column} />
            )}

        </div>
    )
}

export default BoardContent;