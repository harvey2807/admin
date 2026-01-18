import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const BASE_WIDTH = 375; // iPhone 11

export const scale = (size: number) => (width / BASE_WIDTH) * size;
