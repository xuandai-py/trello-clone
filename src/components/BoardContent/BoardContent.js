import Column from 'components/Column/Column'
import React, { useRef } from 'react'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilities/sorts'
import { Draggable, Container } from 'react-smooth-dnd'
import { applyDrag } from 'utilities/dragDrop'
import { Col, Row, Container as BootstrapContainer, Form, Button } from 'react-bootstrap'

const BoardContent = () => {

    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openAddNewColumnForm, setOpenAddNewColumnForm] = useState(false)
    const toggleAddNewColumn = () => setOpenAddNewColumnForm(!openAddNewColumnForm)
    const newColumnInputRef = useRef(null)
    const [newColumnTitle, setNewColumnTitle] = useState('')
    const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)
    // ******************* changeInputValue


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

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) { // exist
            newColumnInputRef.current.focus(),
                newColumnInputRef.current.select()
        }
    }, [openAddNewColumnForm])
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




    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }

        const newColumnToAdd = { // auto gen id = mongodb
            id: Math.random().toString(36).substr(2, 5), // random 5 chars, remove since impl code api
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }

        let newColumns = [...columns]
        newColumns.push(newColumnToAdd)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(cId => cId.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)
        setNewColumnTitle('')
        toggleAddNewColumn()
    }

    const onUpdateColumn = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id
        let newColumns = [...columns]
        const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)
        console.log(columnIndexToUpdate)
        if (newColumnToUpdate._destroy) {
            console.log(columnIndexToUpdate)
            newColumns.splice(columnIndexToUpdate, 1)
        } else {
            console.log(newColumnToUpdate)
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
        }

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(cId => cId.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)
        console.log(newBoard);
        console.log(board);

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
                        <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
                    </Draggable>
                )}
            </Container>
            <BootstrapContainer className="bootstrap-container">
                <Row className="last-card-row">
                    <Col className="add-new-column" onClick={toggleAddNewColumn}>
                        <i className="fa fa-plus icon" />Add another column
                    </Col>
                </Row>

                {openAddNewColumnForm &&
                    <Row className="last-card-row">
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
                            <span className="cancel-icon" onClick={toggleAddNewColumn}>
                                <i className="fa fa-times" />
                            </span>
                        </Col>
                    </Row>
                }
            </BootstrapContainer>

        </div>
    )
}

export default BoardContent