import { Navbar, Container, Nav } from "react-bootstrap";

function Header() {
  return (
    <>
      <Navbar bg='light'>
        <Container fluid>
          <Navbar.Brand href='/'>OQM System</Navbar.Brand>
          <Nav className=' ms-auto'>
            <Nav.Link href='get-ticket'>Get ticket</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
