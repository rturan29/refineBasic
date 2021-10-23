import { Refine, Resource } from "@pankod/refine";

import "@pankod/refine/dist/styles.min.css";
import { firebaseAuth } from "helpers/firebaseAuth";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { CourseList, CourseShow, CourseEdit } from "pages/courses";
import { SessionCreate, SessionEdit, SessionList, SessionShow } from "pages/sessions";
import { UserCreate, UsersList } from "pages/users";
import { firestoreDatabase } from "helpers/FirestoreDatabase";


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
        name="courses"
        list={CourseList}
        show={CourseShow}
        edit={CourseEdit}
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
