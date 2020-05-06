import React, { Component } from 'react';
import { database } from './firebase';

export default class Chat extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      username: '',
      users: {}
    };

    this.onAddMessage = this.onAddMessage.bind(this);
  }

  componentWillMount() {
    database.ref('streaming/event/pid01/users').on('value', snapshot => {
        this.setState({
            users: snapshot.val()
        });
    });

    const username = localStorage.getItem('chat_username');
    this.setState({username: username ? username : 'Unknown'})
    const messagesRef = database.ref('streaming/event/pid01/messages')
      .orderByKey()
      .limitToLast(100);

    messagesRef.on('value', snapshot => {
      let messagesObj = snapshot.val();

      if (messagesObj) {
        let messages = [];
        Object.keys(messagesObj).forEach(key => messages.push(messagesObj[key]));
        messages = messages.map((message) => { return {text: message.text, user: message.user, id: message.key, datetime: message.datetime}})
        this.setState(prevState => ({
          messages: messages,
        }));
      }
    });
  }

    onAddMessage(event) {
        event.preventDefault();
        database.ref('streaming/event/pid01/messages').push({
            user: this.state.username,
            text: this.input.value,
            datetime: JSON.stringify(new Date())
        });
        this.input.value = '';
    }

  render() {
    return (
      <div>
        <div className="padding-13 messages-div">
            <h2>Chat Messages</h2>
            {
                this.state.messages.map((message) => {
                    const _class = message.user === this.state.username ? 'message-right container' : 'message-left container';
                    let nickname = '';
                    let datetime = new Date(JSON.parse(message.datetime));
                    datetime = datetime.getDate() + "/" + datetime.getMonth() + "/" + datetime.getFullYear() + " " + datetime.getHours() + ":" + datetime.getMinutes();

                    Object.keys(this.state.users).map((key) => {
                        if ((this.state.users[key]).username == message.user) {
                            nickname = (this.state.users[key]).nickname;
                        }
                    });

                    return (
                        <div className={_class}>
                            <h6 className="name-heading">{nickname}</h6>
                            <p className="marg-left-10">{message.text}</p>
                            <span className="time-left">{datetime}</span>
                        </div>
                    )
                })
            }
        </div>
      <div className="container textarea-div">
        <textarea className="text-area" ref={node => this.input = node}></textarea>
        <button className="btn btn-info send-btn " onClick={this.onAddMessage}>Send</button>
      </div>
    </div>
    );
  }
}
