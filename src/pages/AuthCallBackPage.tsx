
import { useAuth0 } from "@auth0/auth0-react";
import { useCreateMyUser, useGetCurrentUser } from "@/api/MyUserApi";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

const AuthCallBackPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth0();
  const { createUser } = useCreateMyUser();
  const hasCreatedUser = useRef(false);
  const { currentUser, isLoading } = useGetCurrentUser();

  // Crea usuario en el backend si no existe
  useEffect(() => {
    const handleUserCreation = async () => {
      if (user?.sub && user?.email && !hasCreatedUser.current) {
        await createUser({ auth0Id: user.sub, email: user.email });
        hasCreatedUser.current = true;
      }
    };
    handleUserCreation();
  }, [createUser, user]);

  // Redirige cuando ya terminó de cargar
  useEffect(() => {
    if (!isLoading && !authLoading) {
      if (!currentUser) {
        // fallback si no se pudo traer el usuario
        navigate("/");
        return;
      }

      if (currentUser.role === "unauthorized") {
        navigate("/user-unauthorized");
      } else {
        navigate("/home-page");
      }
    }
  }, [currentUser, isLoading, authLoading, navigate]);

  return <Spinner />;
};

export default AuthCallBackPage;
