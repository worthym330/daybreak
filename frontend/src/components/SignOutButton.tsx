import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = (props:any) => {
  // const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const classNames = props?.classNames? props?.classNames : "";

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // await queryClient.invalidateQueries("validateToken");
      localStorage.removeItem("auth_token")
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
      className={`flex bg-transparent items-center px-5 py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black ${classNames}`}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;