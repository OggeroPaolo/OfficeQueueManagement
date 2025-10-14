import { Navbar, Container, Nav } from "react-bootstrap";
import { Outlet } from "react-router";

function Header() {
  return (
    <>
      <Navbar bg='light'>
        <Container fluid>
          <Navbar.Brand href='/'>OQM System</Navbar.Brand>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Header;
