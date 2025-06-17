import mongoose from 'mongoose';

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  userId: string;
  variables?: {
    key: string;
    value: string;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  variables: {
    type: [{
      key: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: String,
        required: true
      },
      description: {
        type: String,
        trim: true
      }
    }],
    default: []
  }
}, {
  timestamps: true
});

// Create compound index for efficient querying
ProjectSchema.index({ userId: 1, name: 1 }, { unique: true });

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
