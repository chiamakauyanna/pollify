import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Result {
  option: string;
  votes: number;
}

interface ResultState {
  results: Result[];
}

const initialState: ResultState = {
  results: [],
};

const resultSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },
    updateVote: (state, action: PayloadAction<{ option: string }>) => {
      const index = state.results.findIndex(r => r.option === action.payload.option);
      if (index !== -1) {
        state.results[index].votes += 1;
      }
    },
  },
});

export const { setResults, updateVote } = resultSlice.actions;
export default resultSlice.reducer;
