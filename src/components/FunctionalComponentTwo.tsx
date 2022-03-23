import React, {useState} from 'react';


interface IProps {
    initialCounter: number;
}

export default function Counter(props: IProps) {

    const [counter, setCounter] = useState(props.initialCounter);

    const add = () => {
        setCounter(counter + 1);
    }

    const remove = () => {
        setCounter(counter - 1);
    }

    return (
        <div>
            <h4>My counter from component: {counter}</h4>
            <button onClick={add}>Add</button>
            <button onClick={remove}>Remove</button>
        </div>
    );
}
