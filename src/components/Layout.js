import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div>
      <Sidebar children={children} />
    </div>
  );
};

export default Layout;
