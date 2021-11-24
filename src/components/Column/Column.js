/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react'
import Card from 'components/Card/Card'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import { selectAllInlineText, handleColumnTitleKeyDown } from 'utilities/contentEditable'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

const Column = (props) => {
    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
    const [columnTitle, setColumnTitle] = useState('')
    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

    const [openAddNewCardForm, setOpenAddNewCardForm] = useState(false)
    const toggleAddNewCard = () => setOpenAddNewCardForm(!openAddNewCardForm)
    const newCardTextareaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) { // exist
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openAddNewCardForm])


    const onConfirmModalAction = (type) => {
        //if (type === MODAL_ACTION_CLOSE) {}
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = { ...column, _destroy: true }
            onUpdateColumn(newColumn)
        }
        toggleShowConfirmModal()
    }


    const handleColumnTitleBlur = () => {
        const newColumn = { ...column, title: columnTitle }
        onUpdateColumn(newColumn)
    }

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus()
            return
        }
        const newCardToAdd = {
            id: Math.random().toString(36).substr(2, 5), // random 5 chars, remove since impl code api
            boardId: column.boardId,
            columnId: column.id,
            title: newCardTitle.trim(),
            cover: null
        }

        let newColumn = { ...column }
        newColumn.cards.push(newCardToAdd)
        newColumn.cardOrder.push(newCardToAdd.id)
        setNewCardTitle('')
        toggleAddNewCard()

        onUpdateColumn(newColumn)

    }
    return (
        <>
            <div className="column">
                <header className="column-drag-handle">
                    <div className="column-title">
                        <Form.Control
                            size="sm"
                            type="text"
                            className="rb-content-editable"
                            defaultValue={column.title}
                            onChange={handleColumnTitleChange}
                            onBlur={handleColumnTitleBlur}
                            spellCheck="false"
                            onClick={selectAllInlineText}
                            onKeyDown={handleColumnTitleKeyDown}
                            onMouseDown={e => e.preventDefault()}
                        />
                    </div>
                    <div className="column-dropdown-actions">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column ...</Dropdown.Item>
                                <Dropdown.Item >Sort By</Dropdown.Item>
                                <Dropdown.Item >Move all cards in this list</Dropdown.Item>
                                <Dropdown.Item >Archive all cards in this list</Dropdown.Item>
                                <Dropdown.Item >Archive this list</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header>
                <div className="card-list">
                    <Container
                        groupName="col"
                        orientation="vertical"
                        onDrop={dropResult => onCardDrop(column.id, dropResult)}
                        getChildPayload={index => cards[index]}
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        dropPlaceholder={{
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'card-drop-preview'
                        }}
                        dropPlaceholderAnimationDuration={200}
                    >
                        {cards.map((card) =>
                            <Draggable key={card.id}>
                                <Card card={card} />
                            </Draggable>)}
                    </Container>

                    {openAddNewCardForm &&
                        <div className="add-new-card-area">
                            <Form.Control
                                size="sm"
                                as="textarea"
                                row="3"
                                placeholder="Enter a title for this card..."
                                className="textarea-enter-new-card"
                                ref={newCardTextareaRef}
                                value={newCardTitle}
                                onChange={onNewCardTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                            />
                        </div>
                    }
                </div>
                <footer>
                    {openAddNewCardForm &&
                        <div className="add-new-card-area">
                            <Button variant="success" size="sm" onClick=
                                {addNewCard} >Add Card</Button>
                            <span className="cancel-icon" onClick={toggleAddNewCard}>
                                <i className="fa fa-times" />
                            </span>
                        </div>
                    }
                    {!openAddNewCardForm &&
                        <div className="footer-action" onClick={toggleAddNewCard}>
                            <i className="fa fa-plus icon" />Add another card
                        </div>
                    }
                </footer>

                <ConfirmModal
                    show={showConfirmModal}
                    onAction={onConfirmModalAction}
                    title="Remove column"
                    content={`You're trying to remove this <strong>${column.title}</strong> column.<br/> This action can not be undo!`} />
            </div>
        </>

    )
}

export default Column