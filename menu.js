// menuitems is cached here in this module. You can make an initial load from db instead.
var menuitems = [];
// getting them is simple, always just get the current array. We'll use that.
var getMenuItems = function() {
    return menuitems;
}

// this executes when we have already inserted - calls the callback
var addMenuItemHandler = function(newItem, callback) {
    // validate that it's not empty or that it does not match any of the existing ones
    menuitems.push(newItem);
    // remember, push item to local array only after it's added to db without errors
    callback();
}
// this one accepts a request to add a new menuitem
var addMenuItem = function(req, res) {
    var newItem = req.query.newitem;

    // it will do db insert, or setTimeout in my case
    setTimeout(function(newItem){
        // we also close our request in a callback
        addMenuItemHandler(newItem, function(){
            res.end('Added.');
        });

    }, 2000);
};

module.exports = {
    addMenuItem: addMenuItem,
    getMenuItems: getMenuItems
}