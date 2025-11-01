
import { useEffect } from "react";
import { GlobalNotification } from "./common/component/notification";
import MainRoute from "./common/routes/main_routes";
import { useIsAuthenticatedStore } from "./utils/hooks/use_is_authenticated_store";
import { useCurrentUserStore } from "./utils/hooks/use_current_user";
import { useAuthTokenStore } from "./utils/hooks/use_auth_token_store";
import PopupMenu from "./common/component/PopUpMenu";





function App() {

  const {
    isAuthenticated, checkIsAuthenticated
  } = useIsAuthenticatedStore()


  const { token } = useAuthTokenStore()
  const { user } = useCurrentUserStore()
  useEffect(
    () => {
      checkIsAuthenticated()

    }, []
  )
  console.log(isAuthenticated)
  console.log(user)
  console.log(token)

  return (
    <>
      <GlobalNotification />
      <MainRoute />
      <PopupMenu />
    </>
  );
}

export default App;
