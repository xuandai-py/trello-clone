import Column from 'components/Column/Column'
import React from 'react'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { Draggable, Container } from 'react-smooth-dnd'
import { applyDrag } from 'utilities/dragDrop'

const BoardContent = () => {

    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        //const boardFromDB = initialData.boards.map((board) => {key: board.id, board})
        if (boardFromDB) {
            setBoard(boardFromDB)

            // sortColumns

            mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id')
            setColumns(boardFromDB.columns)
        }

    }, [])

    if (isEmpty(board)) {
        return (
            <div className="not-found">Board not found</div>
        )
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns]
        let newBoard = { ...board }
        newColumns = applyDrag(newColumns, dropResult)

        newBoard.columnOrder = newColumns.map(cId => cId.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)

        console.log(newBoard)
        console.log(newColumns)
        console.log(columns)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns]
            let currentColumn = newColumns.find(cId => cId.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(cardId => cardId.id)
            setColumns(newColumns)
        }
    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column) =>
                    <Draggable key={column.id}>
                        <Column column={column} onCardDrop={onCardDrop} />
                    </Draggable>
                )}
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon" />Add another card
            </div>

        </div>
    )
}

export default BoardContent