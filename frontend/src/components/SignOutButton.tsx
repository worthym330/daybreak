import { useMutation } from "react-query";
import * as apiClient from "../api-client";
// import { useAppContext } from "../contexts/AppContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SignOutButton = (props:any) => {
  // const queryClient = useQueryClient();
  // const { showToast } = useAppContext();
  const navigate = useNavigate()
  const classNames = props?.classNames? props?.classNames : "";

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // await queryClient.invalidateQueries("validateToken");
      Cookies.remove("authentication");
      // showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate('/')
    },
    onError: (error: Error) => {
      // showToast({ message: error.message, type: "ERROR" });
      console.log(error.message)
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className={`${classNames}`}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;