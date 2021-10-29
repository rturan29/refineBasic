import { Refine, Resource } from "@pankod/refine";

import "@pankod/refine/dist/styles.min.css";
import { firebaseAuth } from "helpers/firebase/firebaseAuth";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { WorkshopList, WorkshopShow, WorkshopEdit } from "pages/workshops";
import { SessionCreate, SessionEdit, SessionList, SessionShow } from "pages/sessions";
import { UserCreate, UsersList } from "pages/users";
import { firestoreDatabase } from "helpers/firebase/FirestoreDatabase";


function App() {

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
