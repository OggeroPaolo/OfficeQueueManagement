import { Navbar, Container, Nav } from "react-bootstrap";
import { Outlet } from "react-router";

function Header() {
  return (
    <>
      <Navbar bg='light'>
        <Container fluid>
          <Navbar.Brand href='/'>OQM System</Navbar.Brand>
          <Nav className=' ms-auto'>
            <Nav.Link href='get-ticket'>Get ticket</Nav.Link>
            <Nav.Link href='counter-next-ticket'>Call next customer</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Header;
