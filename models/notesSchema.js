const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    note_id: {
        type: mongoose.Schema.Types.ObjectId,       // ObjectId type for unique note IDs
        auto: true                                 
    },
    title: {
        type: String,
        required: true,                            
        trim: true                                  
    },
    description: {
        type: String,
        required: true                              
    },
    created_at: {
        type: Date,
        default: Date.now       
    },
    updated_at: {
        type: Date,
        default: Date.now                             
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
});

// Pre-save middleware to update 'updated_at' on every update
noteSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});




const note = mongoose.model('Note', noteSchema);
module.exports = note ;