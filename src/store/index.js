import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./auth/authSlice";
import storage from "redux-persist/lib/storage";
import commonReducer from "./common/commonSlice";
import currentAppTokenReducer from "./currentAppToken/currentAppToken";
import categoryReducer from "./category/categorySlice";
import subCategoryReducer from "./category/subCategorySlice";
import packageReducer from "./package/packageSlice";
import bannerReducer from "./banner/BannerSlice";
import notificationReducer from "./notifications/notificationsSlice";
import notificationRealTimeReducer from "./notificationRealTime/notificationRealTimeSlice";
import chatReducer from "./chat/chatSlice";
import DeletedProductsReducer from "./products/deletedProductsSlice";
import HomeImageReducer from "./homePageImage/homePageImageSlice";
import ReferralReducer from "./referral/referralSlice";
import RefundReducer from "./refund/refundSlice";
import PaymentInquiryReducer from "./paymentInquiry/paymentInquirySlice";
import customizationReducer from "./customize/customizationSlice";
import variationReducer from "./variation/variationSlice";
import imageReducer from "./variation/productImageSlice";




export const allReducers = combineReducers({
  image:imageReducer,
  variation:variationReducer,
  common: commonReducer,
  
  auth: authReducer,
  appToken: currentAppTokenReducer,
  category: categoryReducer,
  subCategory: subCategoryReducer,
  package: packageReducer,
  banner: bannerReducer,
  notification: notificationReducer,
  notificationRealTime: notificationRealTimeReducer,
  chat: chatReducer,
  products: DeletedProductsReducer,
  homeImage: HomeImageReducer,
  referral: ReferralReducer,
  refund: RefundReducer,
  paymentInquiry: PaymentInquiryReducer,
  customization: customizationReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["common"],
};

const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
