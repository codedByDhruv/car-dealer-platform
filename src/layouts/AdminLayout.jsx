import { Layout, Menu } from "antd";
const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            { key: "1", label: "Dashboard" },
            { key: "2", label: "Users" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 16 }}>
          <h2>Admin Panel</h2>
        </Header>

        <Content style={{ margin: "16px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
