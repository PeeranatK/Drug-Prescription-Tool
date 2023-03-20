import React from 'react'

const SelectItem = ({ saveinput, onDeleteClick }) => {

    return (
        <li key = {saveinput.id}>
            {saveinput.text}
            {" "}
            <button onClick={() => onDeleteClick(saveinput.id)}>X</button>
        </li>
    )
}

export default SelectItem