var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Title
// b.Description
// c.Deadline
// d.Task Type (Public / Private)
// e.Posted xx hours ago (Timestamp obtained from database)
// Tasks can be of two types:
// a.Private: Can only be seen by the user who created the task
// b.Public: Can be seen by all users

var Task = new Schema({
    title: String,
    description: String,
    deadline: Date,
    private: {
        type: Boolean,
        default: true
    },
    forUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Task', Task);