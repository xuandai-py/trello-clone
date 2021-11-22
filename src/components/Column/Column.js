import React, { useState, useCallback, useEffect, useRef } from 'react'
import Card from 'components/Card/Card'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import { selectAllInlineText, handleColumnTitleKeyDown } from 'utilities/contentEditable'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

const Column = (props) => {
    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
    const [columnTitle, setColumnTitle] = useState('')
    const editTitleInputRef = useRef(null)

    const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])


    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])


    const onConfirmModalAction = (type) => {
        //if (type === MODAL_ACTION_CLOSE) {}
        if (type === MODAL_ACTION_CONFIRM) {
            onUpdateColumn({ ...column, _destroy: true })
        }
        toggleShowConfirmModal()
    }


    const handleColumnTitleBlur = () => {
        onUpdateColumn({ ...column, _title: columnTitle })
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
                </div>
                <footer>
                    <div className="footer-action">
                        <i className="fa fa-plus icon" />Add another card
                    </div>
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