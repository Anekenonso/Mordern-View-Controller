/*
* this will manage the data of the application
*/

class User {
    constructor({name, age, complete} = {complete: false}) {
        this.id = this.uuidv4();
        this.name = name;
        this.age = age;
        this.complete = complete;
    }

    uuidv4() {
        return([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>     
        (
          c ^
           (Crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
        );
    }

    // constructor for the user data

    constructor(){
        const users = JSON.parse(localStorage.getItem('users')) || [];
        this.users = users.map(user => new User(user));
    }

    //each of the operation we want to develop
    add(user) {
        this.users.push(new User(user));

        this._commit(this.users);
    }

    edit(id, userToEdit) {
        this.users = this.users.map(user => 
         
            user.id === id 
            ? new User({
                ...user,
                ...userToEdit
            })
            : user
        );

        this._commit(this.users);
    }

    delete(_id) {
        this.users = this.users.filter(({ id }) => id !== _id);

        this._commit(this.users);
    }

    toggle(_id) {
        this.users = this.users.map(user => user.id === _id ?
            new User({...user, complete: !user.complete}) :user
            );

            this._commit(this.users);
    }

//commit method responsible for storing operation performed in the data store
    bindUserListChanged(callback) {
        this.onUserListChanged = callback;
    }

    _commit(users) {
        this.onUserListChanged(users);
        localStorage.setItem('users', JSON.stringify(users));
    }

    

}