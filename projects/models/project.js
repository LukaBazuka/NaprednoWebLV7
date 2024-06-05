var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  tasks: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  archived: { type: Boolean, default: false },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', ProjectSchema);
