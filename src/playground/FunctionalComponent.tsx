import React, {useState} from 'react';


interface IProps {
    initialCounter: number;
}

export default function Counter(props: IProps) {

    const [counter, setCounter] = useState(props.initialCounter);

    return (
        <div>
            <h4>My counter from component: {counter}</h4>
            <button onClick={() => setCounter(counter + 1)}>Add</button>
            <button onClick={() => setCounter(counter - 1)}>Remove</button>
        </div>
    );
}
