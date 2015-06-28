/** @jsx React.DOM */
var React = require('react');
var CommentBox = require('./CommentBox.js');
var App = require('./App.js');
var FilterableProductTable = require('./FilterableProductTable.js');

function commentBoxApp() {
  React.render(
    <CommentBox url="comments.json" pollInterval={2000} />,
    document.getElementById('content')
  );  
}

function reactApp() {
  React.render(
    <App/>,
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
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('content')
  );
}

//commentBoxApp();
//reactApp();
filterableProductTableApp();
