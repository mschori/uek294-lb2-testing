interface User {
    name: string;
    id: number;
}

class UserAccount {
    name: string;
    id: number;

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }
}


const user0: User = {
    name: "Michael",
    id: 1
}

const user1: User = new UserAccount("Irene", 2);


function getAdminUser(): User {
    let user3: User = {
        name: "Yuna",
        id: 3
    }
    return user3
}

function deleteUser(user: User) {
    // ...
}



export {}
