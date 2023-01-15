import {useContext} from "react";
import {AuthContext, IAuthContextType} from "../contexts/AuthContext";

const useAuth = () => useContext(AuthContext) as IAuthContextType;

export default useAuth;