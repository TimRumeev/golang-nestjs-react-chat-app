import { User } from "@/types/model.type";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {},
  setUser: (user: User) => {},
} as UserContextInterface;

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext(defaultState);

export default function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User>(defaultState.user);
  	return (
		  <UserContext.Provider value={{user, setUser}}> 
        {children} 
      </UserContext.Provider>
	  )
}
