import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import authScreenAtom from "../atoms/authAtom";
import SignupCard from "../components/SignupCard";
import Login from "../components/Login";

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  //whenever u want u can get this first value and get set value function
  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;
