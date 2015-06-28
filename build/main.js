(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/App.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');

var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("h1", null, "Hello world!")
    );
  }

});

module.exports = App;

},{"react":"react"}],"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/CommentBox.js":[function(require,module,exports){
var React = require('react');

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
        React.createElement(Comment, {key: comment.id, author: comment.author}, 
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

module.exports = CommentBox;

},{"react":"react"}],"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/FilterableProductTable.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');

var ProductCategoryRow = React.createClass({displayName: "ProductCategoryRow",
    render: function() {
        return (React.createElement("tr", null, React.createElement("th", {colSpan: "2"}, this.props.category)));
    }
});

var ProductRow = React.createClass({displayName: "ProductRow",
    render: function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            React.createElement("span", {style: {color: 'red'}}, 
                this.props.product.name
            );
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, name), 
                React.createElement("td", null, this.props.product.price)
            )
        );
    }
});

var ProductTable = React.createClass({displayName: "ProductTable",
    render: function() {
        console.log(this.props);
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(React.createElement(ProductCategoryRow, {category: product.category, key: product.category}));
            }
            rows.push(React.createElement(ProductRow, {product: product, key: product.name}));
            lastCategory = product.category;
        }.bind(this));
        return (
            React.createElement("table", null, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", null, "Name"), 
                        React.createElement("th", null, "Price")
                    )
                ), 
                React.createElement("tbody", null, rows)
            )
        );
    }
});

var SearchBar = React.createClass({displayName: "SearchBar",
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },
    render: function() {
        return (
            React.createElement("form", null, 
                React.createElement("input", {
                    type: "text", 
                    placeholder: "Search...", 
                    value: this.props.filterText, 
                    ref: "filterTextInput", 
                    onChange: this.handleChange}
                ), 
                React.createElement("p", null, 
                    React.createElement("input", {
                        type: "checkbox", 
                        checked: this.props.inStockOnly, 
                        ref: "inStockOnlyInput", 
                        onChange: this.handleChange}
                    ), 
                    ' ', 
                    "Only show products in stock"
                )
            )
        );
    }
});

var FilterableProductTable = React.createClass({displayName: "FilterableProductTable",
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },

    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },

    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(SearchBar, {
                    filterText: this.state.filterText, 
                    inStockOnly: this.state.inStockOnly, 
                    onUserInput: this.handleUserInput}
                ), 
                React.createElement(ProductTable, {
                    products: this.props.products, 
                    filterText: this.state.filterText, 
                    inStockOnly: this.state.inStockOnly}
                )
            )
        );
    }
});

module.exports = FilterableProductTable;

},{"react":"react"}],"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/main.js":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var CommentBox = require('./CommentBox.js');
var App = require('./App.js');
var FilterableProductTable = require('./FilterableProductTable.js');

function commentBoxApp() {
  React.render(
    React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
    document.getElementById('content')
  );  
}

function reactApp() {
  React.render(
    React.createElement(App, null),
    document.getElementById('content')
  );
}

function filterableProductTableApp() {
  var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
  ];

  React.render(
    React.createElement(FilterableProductTable, {products: PRODUCTS}),
    document.getElementById('content')
  );
}

commentBoxApp();
//reactApp();
//filterableProductTableApp();

},{"./App.js":"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/App.js","./CommentBox.js":"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/CommentBox.js","./FilterableProductTable.js":"/Users/immanuel_ben/Desktop/react-app-boilerplate/app/FilterableProductTable.js","react":"react"}]},{},["/Users/immanuel_ben/Desktop/react-app-boilerplate/app/main.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvQXBwLmpzIiwiYXBwL0NvbW1lbnRCb3guanMiLCJhcHAvRmlsdGVyYWJsZVByb2R1Y3RUYWJsZS5qcyIsImFwcC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQXBwXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIkhlbGxvIHdvcmxkIVwiKVxuICAgICk7XG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIENvbW1lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ29tbWVudFwiLFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYXdNYXJrdXAgPSBtYXJrZWQodGhpcy5wcm9wcy5jaGlsZHJlbi50b1N0cmluZygpLCB7c2FuaXRpemU6IHRydWV9KTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbW1lbnRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDJcIiwge2NsYXNzTmFtZTogXCJjb21tZW50QXV0aG9yXCJ9LCBcbiAgICAgICAgICB0aGlzLnByb3BzLmF1dGhvclxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7X19odG1sOiByYXdNYXJrdXB9fSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIENvbW1lbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkNvbW1lbnRMaXN0XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbW1lbnROb2RlcyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24oY29tbWVudCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50LCB7a2V5OiBjb21tZW50LmlkLCBhdXRob3I6IGNvbW1lbnQuYXV0aG9yfSwgXG4gICAgICAgICAgY29tbWVudC50ZXh0XG4gICAgICAgICkgICAgICAgIFxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbW1lbnRMaXN0XCJ9LCBcbiAgICAgICAgY29tbWVudE5vZGVzXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBDb21tZW50Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDb21tZW50Rm9ybVwiLFxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGUpIHsgXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBhdXRob3IgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuYXV0aG9yKS52YWx1ZS50cmltKCk7XG4gICAgdmFyIHRleHQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMudGV4dCkudmFsdWUudHJpbSgpO1xuICAgIGlmICghdGV4dCB8fCAhYXV0aG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucHJvcHMub25Db21tZW50U3VibWl0KHthdXRob3I6IGF1dGhvciwgdGV4dDogdGV4dH0pO1xuICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRob3IpLnZhbHVlID0gJyc7XG4gICAgUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLnRleHQpLnZhbHVlID0gJyc7XG4gICAgcmV0dXJuO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7Y2xhc3NOYW1lOiBcImNvbW1lbnRGb3JtXCIsIG9uU3VibWl0OiB0aGlzLmhhbmRsZVN1Ym1pdH0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJZb3VyIG5hbWVcIiwgcmVmOiBcImF1dGhvclwifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJTYXkgc29tZXRoaW5nLi4uXCIsIHJlZjogXCJ0ZXh0XCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJzdWJtaXRcIiwgdmFsdWU6IFwiUG9zdFwifSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIENvbW1lbnRCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiQ29tbWVudEJveFwiLFxuICBsb2FkQ29tbWVudHNGcm9tU2VydmVyOiBmdW5jdGlvbigpIHsgXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy51cmwsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkgeyBcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YTogZGF0YX0pO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlQ29tbWVudFN1Ym1pdDogZnVuY3Rpb24oY29tbWVudCkge1xuICAgIC8vIE9wdGltaXN0aWNhbGx5IHVwZGF0ZSB0aGUgbGlzdFxuICAgIHZhciBjb21tZW50cyA9IHRoaXMuc3RhdGUuZGF0YTtcbiAgICB2YXIgbmV3Q29tbWVudHMgPSBjb21tZW50cy5jb25jYXQoW2NvbW1lbnRdKTtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBuZXdDb21tZW50c30pO1xuICAgIFxuICAgIC8vIHN1Ym1pdCB0byB0aGUgc2VydmVyXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy51cmwsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YTogY29tbWVudCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHsgXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IGRhdGF9KTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgfS5iaW5kKHRoaXMpICAgICAgXG4gICAgfSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7IFxuICAgIHJldHVybiB7ZGF0YTogW119O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7IFxuICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcigpO1xuICAgIHNldEludGVydmFsKHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlciwgdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWwpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29tbWVudEJveFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIkNvbW1lbnRzXCIpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50TGlzdCwge2RhdGE6IHRoaXMuc3RhdGUuZGF0YX0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Rm9ybSwge29uQ29tbWVudFN1Ym1pdDogdGhpcy5oYW5kbGVDb21tZW50U3VibWl0fSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50Qm94O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgUHJvZHVjdENhdGVnb3J5Um93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlByb2R1Y3RDYXRlZ29yeVJvd1wiLFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7Y29sU3BhbjogXCIyXCJ9LCB0aGlzLnByb3BzLmNhdGVnb3J5KSkpO1xuICAgIH1cbn0pO1xuXG52YXIgUHJvZHVjdFJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJQcm9kdWN0Um93XCIsXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLnByb3BzLnByb2R1Y3Quc3RvY2tlZCA/XG4gICAgICAgICAgICB0aGlzLnByb3BzLnByb2R1Y3QubmFtZSA6XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7c3R5bGU6IHtjb2xvcjogJ3JlZCd9fSwgXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wcm9kdWN0Lm5hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIG51bGwsIG5hbWUpLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgdGhpcy5wcm9wcy5wcm9kdWN0LnByaWNlKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgUHJvZHVjdFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlByb2R1Y3RUYWJsZVwiLFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xuICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICB2YXIgbGFzdENhdGVnb3J5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcm9wcy5wcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0Lm5hbWUuaW5kZXhPZih0aGlzLnByb3BzLmZpbHRlclRleHQpID09PSAtMSB8fCAoIXByb2R1Y3Quc3RvY2tlZCAmJiB0aGlzLnByb3BzLmluU3RvY2tPbmx5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmNhdGVnb3J5ICE9PSBsYXN0Q2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChQcm9kdWN0Q2F0ZWdvcnlSb3csIHtjYXRlZ29yeTogcHJvZHVjdC5jYXRlZ29yeSwga2V5OiBwcm9kdWN0LmNhdGVnb3J5fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93cy5wdXNoKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvZHVjdFJvdywge3Byb2R1Y3Q6IHByb2R1Y3QsIGtleTogcHJvZHVjdC5uYW1lfSkpO1xuICAgICAgICAgICAgbGFzdENhdGVnb3J5ID0gcHJvZHVjdC5jYXRlZ29yeTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCBcIk5hbWVcIiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRoXCIsIG51bGwsIFwiUHJpY2VcIilcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsLCByb3dzKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgU2VhcmNoQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNlYXJjaEJhclwiLFxuICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25Vc2VySW5wdXQoXG4gICAgICAgICAgICB0aGlzLnJlZnMuZmlsdGVyVGV4dElucHV0LmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICAgIHRoaXMucmVmcy5pblN0b2NrT25seUlucHV0LmdldERPTU5vZGUoKS5jaGVja2VkXG4gICAgICAgICk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsIFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWFyY2guLi5cIiwgXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmZpbHRlclRleHQsIFxuICAgICAgICAgICAgICAgICAgICByZWY6IFwiZmlsdGVyVGV4dElucHV0XCIsIFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInBcIiwgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogdGhpcy5wcm9wcy5pblN0b2NrT25seSwgXG4gICAgICAgICAgICAgICAgICAgICAgICByZWY6IFwiaW5TdG9ja09ubHlJbnB1dFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICAgICAgICAgICcgJywgXG4gICAgICAgICAgICAgICAgICAgIFwiT25seSBzaG93IHByb2R1Y3RzIGluIHN0b2NrXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBGaWx0ZXJhYmxlUHJvZHVjdFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZpbHRlcmFibGVQcm9kdWN0VGFibGVcIixcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlsdGVyVGV4dDogJycsXG4gICAgICAgICAgICBpblN0b2NrT25seTogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFuZGxlVXNlcklucHV0OiBmdW5jdGlvbihmaWx0ZXJUZXh0LCBpblN0b2NrT25seSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGZpbHRlclRleHQ6IGZpbHRlclRleHQsXG4gICAgICAgICAgICBpblN0b2NrT25seTogaW5TdG9ja09ubHlcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoQmFyLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclRleHQ6IHRoaXMuc3RhdGUuZmlsdGVyVGV4dCwgXG4gICAgICAgICAgICAgICAgICAgIGluU3RvY2tPbmx5OiB0aGlzLnN0YXRlLmluU3RvY2tPbmx5LCBcbiAgICAgICAgICAgICAgICAgICAgb25Vc2VySW5wdXQ6IHRoaXMuaGFuZGxlVXNlcklucHV0fVxuICAgICAgICAgICAgICAgICksIFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvZHVjdFRhYmxlLCB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzOiB0aGlzLnByb3BzLnByb2R1Y3RzLCBcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyVGV4dDogdGhpcy5zdGF0ZS5maWx0ZXJUZXh0LCBcbiAgICAgICAgICAgICAgICAgICAgaW5TdG9ja09ubHk6IHRoaXMuc3RhdGUuaW5TdG9ja09ubHl9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlcmFibGVQcm9kdWN0VGFibGU7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQ29tbWVudEJveCA9IHJlcXVpcmUoJy4vQ29tbWVudEJveC5qcycpO1xudmFyIEFwcCA9IHJlcXVpcmUoJy4vQXBwLmpzJyk7XG52YXIgRmlsdGVyYWJsZVByb2R1Y3RUYWJsZSA9IHJlcXVpcmUoJy4vRmlsdGVyYWJsZVByb2R1Y3RUYWJsZS5qcycpO1xuXG5mdW5jdGlvbiBjb21tZW50Qm94QXBwKCkge1xuICBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDb21tZW50Qm94LCB7dXJsOiBcImNvbW1lbnRzLmpzb25cIiwgcG9sbEludGVydmFsOiAyMDAwfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKVxuICApOyAgXG59XG5cbmZ1bmN0aW9uIHJlYWN0QXBwKCkge1xuICBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JylcbiAgKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyYWJsZVByb2R1Y3RUYWJsZUFwcCgpIHtcbiAgdmFyIFBST0RVQ1RTID0gW1xuICAgIHtjYXRlZ29yeTogJ1Nwb3J0aW5nIEdvb2RzJywgcHJpY2U6ICckNDkuOTknLCBzdG9ja2VkOiB0cnVlLCBuYW1lOiAnRm9vdGJhbGwnfSxcbiAgICB7Y2F0ZWdvcnk6ICdTcG9ydGluZyBHb29kcycsIHByaWNlOiAnJDkuOTknLCBzdG9ja2VkOiB0cnVlLCBuYW1lOiAnQmFzZWJhbGwnfSxcbiAgICB7Y2F0ZWdvcnk6ICdTcG9ydGluZyBHb29kcycsIHByaWNlOiAnJDI5Ljk5Jywgc3RvY2tlZDogZmFsc2UsIG5hbWU6ICdCYXNrZXRiYWxsJ30sXG4gICAge2NhdGVnb3J5OiAnRWxlY3Ryb25pY3MnLCBwcmljZTogJyQ5OS45OScsIHN0b2NrZWQ6IHRydWUsIG5hbWU6ICdpUG9kIFRvdWNoJ30sXG4gICAge2NhdGVnb3J5OiAnRWxlY3Ryb25pY3MnLCBwcmljZTogJyQzOTkuOTknLCBzdG9ja2VkOiBmYWxzZSwgbmFtZTogJ2lQaG9uZSA1J30sXG4gICAge2NhdGVnb3J5OiAnRWxlY3Ryb25pY3MnLCBwcmljZTogJyQxOTkuOTknLCBzdG9ja2VkOiB0cnVlLCBuYW1lOiAnTmV4dXMgNyd9XG4gIF07XG5cbiAgUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyYWJsZVByb2R1Y3RUYWJsZSwge3Byb2R1Y3RzOiBQUk9EVUNUU30pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JylcbiAgKTtcbn1cblxuY29tbWVudEJveEFwcCgpO1xuLy9yZWFjdEFwcCgpO1xuLy9maWx0ZXJhYmxlUHJvZHVjdFRhYmxlQXBwKCk7XG4iXX0=
