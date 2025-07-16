const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  laps: { type: Number, required: true },
  pool_length_yards: { type: Number, default: 25 },
  stroke_type: {
    type: String,
    enum: ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'IM'],
    default: 'freestyle',
  },
  totalDistanceYards: Number,
  totalDistanceMiles: Number,
  durationMinutes: Number,
  caloriesBurned: Number,
  notes: String,
}, {
  _id: true,
  timestamps: true,
});

const competitionSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  stroke_type: {
    type: String,
    enum: ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'IM'],
    required: true,
  },
  distance: { type: Number, required: true },
  time: { type: String, required: true },
  meetName: { type: String, required: true },
  date: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  practice_sessions: [practiceSessionSchema],
  competitions: [competitionSchema],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;