import React, { useState, CSSProperties } from 'react';

import {
    AntdLayout,
    Menu,
    Grid,
    Link,
    useMenu,
    useTitle,
    Icons,
    useNavigation,
    useLogout,
} from "@pankod/refine";
import { customComponentList } from './customComponentList';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { IMenuItem } from '@pankod/refine/dist/interfaces';

export const SiderMenu: React.FC = () => {
    const Title = useTitle();
    const { menuItems, selectedKey } = useMenu();

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const breakpoint = Grid.useBreakpoint();
    const isMobile = !breakpoint.lg;

    const { mutate: logout } = useLogout();
    const { push } = useNavigation();

    function onLogOut() {
        logout();
        push("./login");
    }


    return (
        <AntdLayout.Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(isCollapsed: boolean) => setCollapsed(isCollapsed)}
            collapsedWidth={isMobile ? 0 : 80}
            breakpoint="lg"
            style={isMobile ? antLayoutSiderMobile : antLayoutSider}
        >
            <Title collapsed={collapsed} />
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
            >
                {menuItems.map(getMenuItem)}

                {customComponentList.map(getMenuItem)}

                <Menu.Item onClick={onLogOut} key="logout" icon={<Icons.LogoutOutlined />}>
                    {MLTextHelper("00041")}
                </Menu.Item>

            </Menu>
        </AntdLayout.Sider>
    );
};

function getMenuItem({ icon, route, label }: IMenuItem) {
    return (
        <Menu.Item key={route} icon={icon}>
            <Link to={route}>{label}</Link>
        </Menu.Item>
    );
}

const antLayoutSider: CSSProperties = {
    position: "relative",
};
const antLayoutSiderMobile: CSSProperties = {
    position: "fixed",
    height: "100vh",
    zIndex: 999,
};
