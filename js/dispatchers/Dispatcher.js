var Dispatcher = require('flux').Dispatcher;

var Dispatcher = Object.assign(new Dispatcher(), {
    handleGraphAction: function(action) {
        this.dispatch({
            source: 'GRAPH_ACTION',
            action: action
        });
    }

});

module.exports = Dispatcher;
