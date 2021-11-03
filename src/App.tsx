/* eslint-disable react-hooks/exhaustive-deps */
import { Refine, Resource } from "@pankod/refine";
import "@pankod/refine/dist/styles.min.css";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { WorkshopList, WorkshopShow, WorkshopEdit } from "pages/workshops";
import { SessionCreate, SessionEdit, SessionList, SessionShow } from "pages/sessions";
import { UserCreate, UsersList } from "pages/AdminPages/users";
import { useEffect, useState } from "react";
import { firebaseAuth, firestoreDatabase } from "helpers/firebase/firebaseConfig";


function App() {

  const [isAdmin, setIsAdmin] = useState(false);

  const { getAuthProvider, getPermissions } = firebaseAuth

  useEffect(() => {

    getUserStatus();
  }, []);

  async function getUserStatus() {
    const role = await getPermissions();
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
        show={SessionShow}
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
