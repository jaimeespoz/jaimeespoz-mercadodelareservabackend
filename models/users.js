const { Schema, model } = require('mongoose');

const UsersSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    create_at: { type: Date, default: Date.now },
});

// UsersSchema.clearIndex({ name: -1 });

module.exports = model('users', UsersSchema);
