import * as React from "react";
import IUser from '../Objects/IUser';

export default class UserComponent extends React.Component<IUser, {}> {
    constructor(props: IUser) {
        super(props);
        console.log('Constructor called.')
    }

    render() {
        return (
            <div>
                <h1>User Component</h1>
                Hello, <b>{this.props.name}</b>
                <br/>
                You are <b>{this.props.age} years old</b>
                <br/>
                You live at: <b>{this.props.address}</b>
                <br/>
                You were born: <b>{this.props.dob.toDateString()}</b>
            </div>
        )
    }
}
