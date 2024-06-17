import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import Cookies from "js-cookie";

const SignOutButton = (props:any) => {
  // const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const classNames = props?.classNames? props?.classNames : "";

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // await queryClient.invalidateQueries("validateToken");
      Cookies.remove("authentication");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
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