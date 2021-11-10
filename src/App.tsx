/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Refine } from "@pankod/refine";
import routerProvider from "@pankod/refine-react-router";
import "@pankod/refine/dist/styles.min.css";
import Authentication from "./pages/login/Authentication";
import UpdateUserData from "pages/login/UpdateUserData";
import { SiderMenu } from "components/SiderMenu";
import { WorkshopList, WorkshopShow, WorkshopEdit } from "pages/workshops";
import { SessionCreate, SessionEdit, SessionList } from "pages/sessions";
import { UserCreate, UsersList } from "pages/AdminPages/users";

import { firebaseAuth, firestoreDatabase } from "helpers/firebase/firebaseConfig";
import _ from "lodash";
require(`moment/locale/${window.navigator.language.split("-")[0] || "tr"}`);

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [resources, setResources] = useState<any[]>([{
    name: "workshops",
    list: WorkshopList,
    show: WorkshopShow,
    edit: WorkshopEdit
  }, {
    name: "sessions",
    list: SessionList,
    edit: SessionEdit,
    create: SessionCreate
  },]);

  const { auth, getAuthProvider, getPermissions } = firebaseAuth;
  const { getDataProvider } = firestoreDatabase;

  useEffect(() => {
    if (isAdmin) {
      setResources(_.unionBy(resources, adminResources, "name"));
    }
  }, [isAdmin]);

  useEffect(() => {
    auth.onAuthStateChanged(async () => {
      const claims = await getPermissions();
      setIsAdmin(claims?.role === "admin");
    });
  }, [auth, getPermissions]);


  return (
    <Refine
      LoginPage={Authentication}
      Sider={SiderMenu}
      dataProvider={getDataProvider()}
      authProvider={getAuthProvider()}
      routerProvider={_.set(routerProvider, "routes", _.union(customRoutes, routerProvider.routes))}
      resources={resources} />
  );
}

const adminResources = [{ name: "users", list: UsersList, create: UserCreate }];

const customRoutes = [
  { exact: true, component: UpdateUserData, path: "/update-user-data", }
];

export default App;
