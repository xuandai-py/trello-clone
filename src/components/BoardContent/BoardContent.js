import Column from 'components/Column/Column'
import React from 'react'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { Draggable ,Container } from 'react-smooth-dnd'

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
        console.log(dropResult)
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
                        <Column column={column}/>
                    </Draggable>
                )}
            </Container>

        </div>
    )
}

export default BoardContent