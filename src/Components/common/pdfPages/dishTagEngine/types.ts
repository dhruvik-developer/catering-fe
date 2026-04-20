export interface Dish {
  id: number | string;
  name: string;
  caterer?: string;
}

export interface TagConfig {
  width: number;
  height: number;
  fontFamily: string;
  fontSize: number;
  alignment: "left" | "center" | "right";
  backgroundColor: string;
  textColor: string;
  border: "none" | "solid" | "dashed";
  borderColor?: string;
  borderWidth?: number;
  showCaterer?: boolean;
}
