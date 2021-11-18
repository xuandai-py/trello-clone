import Task from 'components/Task/Task';
import './Column.scss';

const Column = () => {
    return (
        <>
            <div className="column">
                <header>Todo</header>
                <ul className="task-list">
                    <Task />
                    {/* <li className="task-item">Pick a task to take very first step</li>
                    <li className="task-item">Pick a task to take very first step</li>
                    <li className="task-item">Pick a task to take very first step</li>
                    <li className="task-item">Pick a task to take very first step</li>
                    <li className="task-item">Pick a task to take very first step</li> */}
                    

                </ul>
                <footer>Add another card</footer>
            </div>
           
        </>
    )
}

export default Column;