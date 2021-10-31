import { Refine, Resource } from "@pankod/refine";

import "@pankod/refine/dist/styles.min.css";
import firebaseAuth from "helpers/firebase/firebaseAuth";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { WorkshopList, WorkshopShow, WorkshopEdit } from "pages/AdminPages/workshops";
import { SessionCreate, SessionEdit, SessionList, SessionShow } from "pages/AdminPages/sessions";
import { UserCreate, UsersList } from "pages/AdminPages/users";
import { firestoreDatabase } from "helpers/firebase/FirestoreDatabase";
import { useEffect, useState } from "react";


function App() {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUserStatus();
  }, []);

  async function getUserStatus() {
    const role = await firebaseAuth.getPermissions();
    if (role === "admin") {
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
      authProvider={firebaseAuth.getAuthProvider()}
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
        show={SessionShow}
        edit={SessionEdit}
        create={SessionCreate}
      />
      <Resource
        name="users"
        list={UsersList}
        create={UserCreate}
      />
    </Refine>
  );
}

export default App;
