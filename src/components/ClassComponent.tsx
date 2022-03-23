import * as React from 'react';

interface IProps {
    initialCounter: number;
}

interface IState {
    counter: number;
}

export default class CounterClass extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            counter: this.props.initialCounter,
        }
    }

    add = () => {
        this.setState({counter: this.state.counter + 1})
    }

    remove = () => {
        this.setState({counter: this.state.counter - 1})
    }

    render() {
        return (
            <div>
                <h4>My counter from class: {this.state.counter}</h4>
                <button onClick={this.add}>Add</button>
                <button onClick={this.remove}>Remove</button>
            </div>
        );
    }
}
