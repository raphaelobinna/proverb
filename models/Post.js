const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
   
    title: {
        type: String,
        required: true, 
        trim: true,
       
    },
    boo: {
        type: String,
        required: true, 
        
    },
    Translate: {
        type: String,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'] 
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('Post', PostSchema)