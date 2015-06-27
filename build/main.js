(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/main.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
// var App = require('./App.js');
// React.render(<App/>, document.body);

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        React.createElement(Comment, {author: comment.author}, 
          comment.text
        )        
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function(e) { 
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
        React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  loadCommentsFromServer: function() { 
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) { 
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    // Optimistically update the list
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    
    // submit to the server
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) { 
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)      
    });
  },
  getInitialState: function() { 
    return {data: []};
  },
  componentDidMount: function() { 
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});

React.render(
  React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
  document.getElementById('content')
);


},{"react":"react"}]},{},["/Users/immanuel_ben/Desktop/react-app-boilerplate/app/main.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbi8vIHZhciBBcHAgPSByZXF1aXJlKCcuL0FwcC5qcycpO1xuLy8gUmVhY3QucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuYm9keSk7XG5cbnZhciBDb21tZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvbW1lbnRcIixcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmF3TWFya3VwID0gbWFya2VkKHRoaXMucHJvcHMuY2hpbGRyZW4udG9TdHJpbmcoKSwge3Nhbml0aXplOiB0cnVlfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb21tZW50XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgyXCIsIHtjbGFzc05hbWU6IFwiY29tbWVudEF1dGhvclwifSwgXG4gICAgICAgICAgdGhpcy5wcm9wcy5hdXRob3JcbiAgICAgICAgKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtkYW5nZXJvdXNseVNldElubmVySFRNTDoge19faHRtbDogcmF3TWFya3VwfX0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBDb21tZW50TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb21tZW50TGlzdFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21tZW50Tm9kZXMgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudCwge2F1dGhvcjogY29tbWVudC5hdXRob3J9LCBcbiAgICAgICAgICBjb21tZW50LnRleHRcbiAgICAgICAgKSAgICAgICAgXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29tbWVudExpc3RcIn0sIFxuICAgICAgICBjb21tZW50Tm9kZXNcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIENvbW1lbnRGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvbW1lbnRGb3JtXCIsXG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZSkgeyBcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGF1dGhvciA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRob3IpLnZhbHVlLnRyaW0oKTtcbiAgICB2YXIgdGV4dCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy50ZXh0KS52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0IHx8ICFhdXRob3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkNvbW1lbnRTdWJtaXQoe2F1dGhvcjogYXV0aG9yLCB0ZXh0OiB0ZXh0fSk7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmF1dGhvcikudmFsdWUgPSAnJztcbiAgICBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGV4dCkudmFsdWUgPSAnJztcbiAgICByZXR1cm47XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHtjbGFzc05hbWU6IFwiY29tbWVudEZvcm1cIiwgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIllvdXIgbmFtZVwiLCByZWY6IFwiYXV0aG9yXCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIlNheSBzb21ldGhpbmcuLi5cIiwgcmVmOiBcInRleHRcIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInN1Ym1pdFwiLCB2YWx1ZTogXCJQb3N0XCJ9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQ29tbWVudEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb21tZW50Qm94XCIsXG4gIGxvYWRDb21tZW50c0Zyb21TZXJ2ZXI6IGZ1bmN0aW9uKCkgeyBcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7IFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBkYXRhfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVDb21tZW50U3VibWl0OiBmdW5jdGlvbihjb21tZW50KSB7XG4gICAgLy8gT3B0aW1pc3RpY2FsbHkgdXBkYXRlIHRoZSBsaXN0XG4gICAgdmFyIGNvbW1lbnRzID0gdGhpcy5zdGF0ZS5kYXRhO1xuICAgIHZhciBuZXdDb21tZW50cyA9IGNvbW1lbnRzLmNvbmNhdChbY29tbWVudF0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IG5ld0NvbW1lbnRzfSk7XG4gICAgXG4gICAgLy8gc3VibWl0IHRvIHRoZSBzZXJ2ZXJcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBjb21tZW50LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyBcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YTogZGF0YX0pO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICB9LmJpbmQodGhpcykgICAgICBcbiAgICB9KTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHsgXG4gICAgcmV0dXJuIHtkYXRhOiBbXX07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHsgXG4gICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKCk7XG4gICAgc2V0SW50ZXJ2YWwodGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyLCB0aGlzLnByb3BzLnBvbGxJbnRlcnZhbCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb21tZW50Qm94XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiQ29tbWVudHNcIiksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRMaXN0LCB7ZGF0YTogdGhpcy5zdGF0ZS5kYXRhfSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENvbW1lbnRGb3JtLCB7b25Db21tZW50U3VibWl0OiB0aGlzLmhhbmRsZUNvbW1lbnRTdWJtaXR9KVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tbWVudEJveCwge3VybDogXCJjb21tZW50cy5qc29uXCIsIHBvbGxJbnRlcnZhbDogMjAwMH0pLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpXG4pO1xuXG4iXX0=
