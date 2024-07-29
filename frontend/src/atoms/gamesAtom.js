import { atom } from "recoil";

const gamesAtom = atom({
  key: "gamesAtom",
  default: [],
});

export default gamesAtom;
