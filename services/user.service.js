/**
 * @class service
 * 
 * this will manage the data of tyhe application
 */

 class UserService {
      constructor() {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          this.users = users.map(user => new User(user));
      }

      bindUserListChanged(callback) {
          this.onUserListChangted = callback;
      }

      _commit(users){
          this.onUserListChangted(users);
          localStorage.setItem('users', JSON.stringify(users));
      }

      add(user) {
          this.users.push(new User(user));

          this._commit(this.users);
      }

      edit(id, userToEdit) {
          this.users = this.users.map(user => user.id === id ?
            new User({
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
              new User({...user, complete: !user.complete}) : user
        );

        this._commit(this.users);
    }

    //view constructor

    constructor() {
        this.app = this.getElement('#root');

        this.form = this.createElement('form');
        this.createInput({
            key: 'inputName',
            type: 'text',
            placeholder: 'Nmae',
            name: 'name'
        });
        this.createInput({
            key: 'inputAge',
            type: 'text',
            placeholder: 'Age',
            name: 'age'
        });

        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Submit';

        this.form.append(this.inputName, this.inputAge, this.submitButton);

        this.title = this.createElement('h1');
        this.title.textContent = 'Users';
        this.userList = this.createElement('ul', 'user-list');
        this.app.append(this.title, this.form, this.userList);
        
        this._temporaryAgeText = '';
        this._initLocalListeners();
    }

    // union of the view which is the service method
    bindAddUser(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this._nameText) {
                handler({
                    name: this._nameText,
                    age: this._ageText
                });
                this._resetInput();
            }
        });
    }

    bindDeleteUser(handler) {
        this.userList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = event.target.parentElement.id;

                handler(id);
            }
        });
    }

    bindEditUser(handler) {
        this.userList.addEventListener('focusout', event => {
            if (this._temporaryAgeText) {
                const id = event.target.parentElement.id;
                const key = 'age';
                
                handler(id, { [key]: this._temporaryAgeText });
                this._temporaryAgeText = '';
            }
        });
    }

    bindToggleUser(handler) {
        this.userList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = event.target.parentElement.id;
                
                handler(id);
            }
        });
    }
 }