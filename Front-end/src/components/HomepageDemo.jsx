import { Button, Container, Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router";

function HomepageDemo() {
  const navigate = useNavigate();

  const officerNavigate = (counter) => {
    navigate(`/counter-next-ticket/${counter}`);
  };

  return (
    <>
      <Container fluid className='text-center pb-5 mt-5 pt-5'>
        <h3>Customer interface:</h3>
        <Container fluid className='mt-4'>
          <Button
            href='/get-ticket'
            variant='secondary'
            size='lg'
            className='me-3'
          >
            Customer interface
          </Button>
        </Container>
      </Container>
      <Container fluid className='text-center pb-5'>
        <h3>Officer interface:</h3>
        <Container fluid className='mt-4'>
          <DropdownButton
            id='dropdown-basic-button'
            title='Officer interface'
            variant='secondary'
            size='lg'
            className='me-3'
          >
            <Dropdown.Item onClick={() => officerNavigate("Counter 1")}>
              Counter 1
            </Dropdown.Item>
            <Dropdown.Item onClick={() => officerNavigate("Counter 2")}>
              Counter 2
            </Dropdown.Item>
            <Dropdown.Item onClick={() => officerNavigate("Counter 3")}>
              Counter 3
            </Dropdown.Item>
          </DropdownButton>
        </Container>
      </Container>
    </>
  );
}

export default HomepageDemo;
