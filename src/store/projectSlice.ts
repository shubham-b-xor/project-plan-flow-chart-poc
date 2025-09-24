import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  projectName: string;
  isDirty: boolean; // Track if project has unsaved changes
  lastSaved: string | null;
}

const initialState: ProjectState = {
  projectName: 'Untitled Project',
  isDirty: false,
  lastSaved: null
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
      state.isDirty = true;
    },
    
    markDirty: (state) => {
      state.isDirty = true;
    },
    
    markSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
    
    resetProject: (state) => {
      state.projectName = 'Untitled Project';
      state.isDirty = false;
      state.lastSaved = null;
    },
    
    loadProject: (state, action: PayloadAction<{
      projectName: string;
      lastSaved?: string;
    }>) => {
      state.projectName = action.payload.projectName;
      state.lastSaved = action.payload.lastSaved || null;
      state.isDirty = false;
    }
  }
});

export const {
  setProjectName,
  markDirty,
  markSaved,
  resetProject,
  loadProject
} = projectSlice.actions;

export default projectSlice.reducer;