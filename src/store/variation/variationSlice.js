import { createSlice } from "@reduxjs/toolkit";

const variationSlice = createSlice({
  name: "variation",
  initialState: {
    variation: [],
    metal_type: [],
    gem_shape: [],
    ring: false, // Initialize with a default value (false)
  },
  reducers: {
    setVariation: (state, { payload }) => {
      state.variation = payload;
    },
    setMetal: (state, { payload }) => {
      state.metal_type = payload;
    },
    setGem: (state, { payload }) => {
      state.gem_shape = payload;
    },
    setRing: (state, { payload }) => {
      state.ring = payload;
    },
  },
});

export const { setVariation, setRing, setMetal, setGem } = variationSlice.actions;
export default variationSlice.reducer;
