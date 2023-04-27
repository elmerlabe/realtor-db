import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div>
      <Sidebar children={children} />
    </div>
  );
};

export default Layout;
