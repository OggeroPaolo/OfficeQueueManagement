import { useState, useEffect } from "react";
import { Spinner, Container, Button, Card, Row, Col } from "react-bootstrap";
import { getNextTicket } from "../API/API";

function CounterNextTicket() {
  const [counterNumber, setCounterNumber] = useState("Counter 1");
  const [loading, setLoading] = useState(true);
  const [ticketCode, setTicketCode] = useState("");
  const [newTicket, setNewTicket] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
    };

    loadData();
  }, []);

  const callNext = async () => {
    const ticket = await getNextTicket(counterNumber);
    setTicketCode(ticket);
    setNewTicket(true);
  };

  return (
    <>
      {loading ? (
        <Spinner animation='border' />
      ) : (
        <>
          <h3 className='ms-3 mt-4 mb-5'> {counterNumber} </h3>
          <Container fluid className='text-center pb-5'>
            {!newTicket ? (
              <p>No ticket is being served currently.</p>
            ) : (
              <>
                <p>Now serving ticket:</p>
                <Row className='justify-content-center'>
                  <Col md='auto'>
                    <Card
                      body
                      className='text-center'
                      style={{
                        borderWidth: "3px",
                        borderStyle: "solid",
                      }}
                    >
                      <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                        {ticketCode}
                      </span>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
            <Container fluid className='mt-5'>
              <Button variant='secondary' size='lg' onClick={() => callNext()}>
                Call next customer
              </Button>
            </Container>
          </Container>
        </>
      )}
    </>
  );
}

export default CounterNextTicket;
