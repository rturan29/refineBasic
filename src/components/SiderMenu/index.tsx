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
            onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
            collapsedWidth={isMobile ? 0 : 80}
            breakpoint="lg"
            style={isMobile ? antLayoutSiderMobile : antLayoutSider}
        >
            <Title collapsed={collapsed} />
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
            >
                {menuItems.map(({ icon, route, label }) => (
                    <Menu.Item key={route} icon={icon}>
                        <Link to={route}>{label}</Link>
                    </Menu.Item>
                ))}

                {customComponentList.map(({ icon, route, label }) => (
                    <Menu.Item key={route} icon={icon}>
                        <Link to={route}>{label}</Link>
                    </Menu.Item>
                ))}

                <Menu.Item onClick={onLogOut} key="logout" icon={<Icons.LogoutOutlined />}>
                    Logout
                </Menu.Item>

            </Menu>
        </AntdLayout.Sider>
    );
};

const antLayoutSider: CSSProperties = {
    position: "relative",
};
const antLayoutSiderMobile: CSSProperties = {
    position: "fixed",
    height: "100vh",
    zIndex: 999,
};