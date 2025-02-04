import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import {
  setGemShapes,
  setGemStoneColors,
  setBirthStones,
  setGemStones,
  setProngStyles,
  setRingSizes,
  setBandWidths,
  setSettingHeights,
  setBespokeCustomizations,
  setBespokeWithTypes,
  setAccentStoneTypes,
} from "./customizationSlice";

export class CustomizationMiddleware extends Component {
  static fetchGemShapes(token) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const res = await ApiCaller.Get("/api/v1/products/gemshapes");

        if (res.data.gemshapes) {
          dispatch(setGemShapes(res.data.gemshapes));
        }
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static fetchGemStoneColors(token) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const res = await ApiCaller.Get("/api/v1/products/gem_stones_colors");

        if (res.data.GemStoneColors) {
          dispatch(setGemStoneColors(res.data.GemStoneColors));
        }
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static fetchBsp() {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const res = await ApiCaller.Get(
          "/api/v1/products/bespoke_customization"
        );

        if (res.data?.BespokeCustomizations) {
          dispatch(setBespokeCustomizations(res.data?.BespokeCustomizations));
        }
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }
  static createBsp(data) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Post(
          "/api/v1/products/bespoke_customization",
          data
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }
  static updateBsp(id, data) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Post(
          "/api/v1/products/bespoke_customization/" + id,
          data
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }
  static deleteBsp(id) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Delete(
          "/api/v1/products/bespoke_customization/" + id
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static fetchBsp_type(id) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const res = await ApiCaller.Get(
          "/api/v1/products/bespoke_customization_types"
        );

        if (res.data?.GemStoneColors) {
          dispatch(setBespokeWithTypes(res.data?.BespokeCustomizationTypes));
        }
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static fetch_bsp_type_by_bsp(id) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const res = await ApiCaller.Get(
          "/api/v1/products/bespoke_customization_types/child/" + id
        );

        if (res.data?.BespokeCustomizationTypes) {
          dispatch(setBespokeWithTypes(res.data?.BespokeCustomizationTypes));
        }
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }
  static createBsp_type(data) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Post(
          "/api/v1/products/bespoke_customization_types",
          data
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static updateBsp_type(id, data) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Post(
          "/api/v1/products/bespoke_customization_types/" + id,
          data
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static deleteBsp_type(id) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Delete(
          "/api/v1/products/bespoke_customization_types/" + id
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static fetchAllCustomizationData(token) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const [
          gemShapes,
          gemStoneColors,
          birthStones,
          gemStones,
          prongStyles,
          ringSizes,
          bandWidths,
          settingHeights,
          bespokeCustomizations,
          bespokeWithTypes,
          accentStoneTypes,
        ] = await Promise.all([
          ApiCaller.Get("/api/v1/products/gemshapes"),
          ApiCaller.Get("/api/v1/products/gem_stones_colors"),
          ApiCaller.Get("/api/v1/products/birthstones"),
          ApiCaller.Get("/api/v1/products/gem_stones"),
          ApiCaller.Get("/api/v1/customization/prong_style"),
          ApiCaller.Get("/api/v1/customization/ring_size"),
          ApiCaller.Get("/api/v1/customization/band_widths"),
          ApiCaller.Get("/api/v1/customization/setting_height"),
          ApiCaller.Get("/api/v1/customization/bespoke_customization"),
          ApiCaller.Get("/api/v1/customization/bespoke_with_types"),
          ApiCaller.Get("/api/v1/customization/accent_stone_type"),
        ]);

        dispatch(setGemShapes(gemShapes.data.gemshapes || []));
        dispatch(setGemStoneColors(gemStoneColors.data.GemStoneColors || []));
        dispatch(setBirthStones(birthStones.data.BirthStones || []));
        dispatch(setGemStones(gemStones.data.Gemstones || []));
        dispatch(setProngStyles(prongStyles.data.data || []));
        dispatch(setRingSizes(ringSizes.data.data || []));
        dispatch(setBandWidths(bandWidths.data.data || []));
        dispatch(setSettingHeights(settingHeights.data.data || []));
        dispatch(
          setBespokeCustomizations(bespokeCustomizations.data.data || [])
        );
        dispatch(
          setBespokeWithTypes(bespokeWithTypes.data.BespokeCustomizations || [])
        );
        dispatch(setAccentStoneTypes(accentStoneTypes.data.data || []));
        dispatch(setNetworkError(false));
      } catch (error) {
        dispatch(setNetworkError(true));
      } finally {
        dispatch(setLoading(false));
      }
    };
  }

  static createCustomization(selections) {
    return async (dispatch) => {
      try {
        dispatch(setLoading(true));

        const res = await ApiCaller.Post(
          "/api/v1/products/update_customization",
          selections
        );

        if (res.status === 200) {
          dispatch(setNetworkError(false));
          return { success: true, message: res.data.Message };
        } else {
          dispatch(setNetworkError(false));
          return { success: false, message: res.data.Message };
        }
      } catch (error) {
        dispatch(setNetworkError(true));
        return {
          success: false,
          message: error?.response?.data?.Message || "Something went wrong",
        };
      } finally {
        dispatch(setLoading(false));
      }
    };
  }
}
