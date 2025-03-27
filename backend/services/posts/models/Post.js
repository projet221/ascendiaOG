const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    platform: [{
        type: String,
        enum: ['twitter', 'facebook', 'instagram', 'linkedin'],
        required: true
    }],
    mediaUrls: [{
        type: String,
        trim: true
    }],
    mediaFiles: [{
        data: Buffer,  // Stocke le fichier sous forme de buffer
        contentType: String  // Stocke le type MIME (ex: image/png, video/mp4)
    }],
    scheduledFor: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'failed'],
        default: 'draft'
    },
    analytics: {
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        reach: { type: Number, default: 0 }
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    }
});

postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post', postSchema);