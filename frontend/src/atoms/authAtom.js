//atom is basically a state
//using recoil - state management library by facebook
//each atom will be one state
//it will determine if we are in login or signup

import { atom } from "recoil";

const authScreenAtom = atom({
  key: "authScreenAtom", //key is required by recoil to differentiate beetween which atom is which
  default: "login",
});

export default authScreenAtom;
