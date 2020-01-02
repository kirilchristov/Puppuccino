import React from "react";
import axios from "axios";
import Signout from "./Signout.jsx"
import UserComponent from "./UserComponent.jsx"
import DogComponent from "./DogComponent.jsx"
import Chatroom from "./Chatroom.jsx"

const AccountPage = props => {
    return (
        <div>
            <Signout />
            <UserComponent />
            <DogComponent />
            <Chatroom />
        </div>
    )
}

export default AccountPage;
