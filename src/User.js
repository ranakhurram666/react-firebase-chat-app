import React, { Component } from 'react';
import { database } from './firebase';

export default class User extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      productid: '',
      productname: '',
      username: '',
      nickname: ''
    };
  }

  componentWillMount() {
    const userRef = database.ref('users')
      .orderByKey()
      .limitToLast(100);

    userRef.once('value', snapshot => {
      const users = [snapshot.val()];
      this.setState({users: users});
    });
  }

  onProductIdChange(e) {
    this.setState({productid: e.target.value})
  }

  onProductNameChange(e) {
    this.setState({productname: e.target.value})
  }

  onUserNameChange(e) {
    this.setState({username: e.target.value})
  }

  onNickNameChange(e) {
    this.setState({nickname: e.target.value})
  }

  onAddClick(e) {
    e.preventDefault();

    const productRef = database.ref('streaming/event/' + this.state.productid);
    productRef.once('value', snapshot => {
        let productObj = snapshot.val();

        if (!productObj) {
            database.ref('streaming/event').update({
                [this.state.productid]: {
                    productid: this.state.productid,
                    productname: this.state.productname
                }
            });
        }

        database.ref('streaming/event/' + this.state.productid + '/users').once('value', snapshot => {
            const usersObj = snapshot.val();
            let userFound = false;
            let keyFound = '';

            Object.keys(usersObj).map((key) => {
                if ((usersObj[key]).username === this.state.username) {
                    userFound = true;
                    keyFound = key;
                }
            });

            if (!userFound) {
                database.ref('streaming/event/' + this.state.productid + '/users').push({
                    username: this.state.username,
                    nickname: this.state.nickname
                });
            }
            else {
                database.ref('streaming/event/' + this.state.productid + '/users/' + keyFound).update({
                    username: this.state.username,
                    nickname: this.state.nickname
                });
            }
            localStorage.setItem('chat_username', this.state.username);
            this.props.history.push('/chat');
        });
    });
  }

  render() {
    return(
    <div className="form-group col-md-4">
        <label >Product id: </label>
        <input className="form-control input-sm" id="inputsm" type="text" onChange={this.onProductIdChange.bind(this)}/>
        <label >Product name: </label>
        <input className="form-control input-sm" id="inputsm" type="text" onChange={this.onProductNameChange.bind(this)}/>
        <label >Username: </label>
        <input className="form-control input-sm" id="inputsm" type="text" onChange={this.onUserNameChange.bind(this)}/>
        <label >Nickname: </label>
        <input className="form-control input-sm" id="inputsm" type="text" onChange={this.onNickNameChange.bind(this)}/>
        <button className="btn btn-info" onClick={this.onAddClick.bind(this)}>Add</button>
    </div>
    );
  }
}