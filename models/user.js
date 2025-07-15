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

const splitTimeSchema = new mongoose.Schema({
  split_number: { type: Number, required: true },
  split_time_seconds: { type: Number, required: true },
});

const competitionSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  meet_name: String,
  date: { type: Date, required: true },
  distance_yards: Number,
  distance_miles: Number,
  stroke_type: {
    type: String,
    enum: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'IM'],
    default: 'Freestyle',
  },
  finalTime: Number,
  caloriesBurned: Number,
  notes: String,
  split_times: [splitTimeSchema],
}, {
  timestamps: true,
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