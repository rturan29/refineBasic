/* eslint-disable react-hooks/exhaustive-deps */
import { Refine, Resource } from "@pankod/refine";
import "@pankod/refine/dist/styles.min.css";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { WorkshopList, WorkshopShow, WorkshopEdit } from "pages/workshops";
import { SessionCreate, SessionEdit, SessionList } from "pages/sessions";
import { UserCreate, UsersList } from "pages/AdminPages/users";
import { useEffect, useState } from "react";
import { firebaseAuth, firestoreDatabase } from "helpers/firebase/firebaseConfig";


function App() {

  const [isAdmin, setIsAdmin] = useState(false);

  const { auth, getAuthProvider, getPermissions } = firebaseAuth;

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user?.uid) {
        getUserStatus();
      }
    });
  }, [auth]);

  async function getUserStatus() {
    const claims = await getPermissions();
    if (claims?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  return (
    <Refine
      LoginPage={Authentication}
      Sider={SiderMenu}
      dataProvider={firestoreDatabase.getDataProvider()}
      authProvider={getAuthProvider()}
      routes={[
        {
          exact: true,
          component: UpdateUserData,
          path: "/update-user-data",
        },
      ]}
    >
      <Resource
        name="workshops"
        list={WorkshopList}
        show={WorkshopShow}
        edit={WorkshopEdit}
      />
      <Resource
        name="sessions"
        list={SessionList}
        edit={SessionEdit}
        create={SessionCreate}
      />{
        isAdmin
          ? <Resource
            name="users"
            list={UsersList}
            create={UserCreate}
          />
          : null}
    </Refine>
  );
}

export default App;
