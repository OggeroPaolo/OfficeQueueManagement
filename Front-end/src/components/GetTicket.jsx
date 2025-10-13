import { useState, useEffect } from "react";
import { getServices, getNewTicket } from "../API/API.js";
import { Button, Spinner, Container, Row, Col, Card } from "react-bootstrap";

function GetTicket() {
  const [services, setServices] = useState([]);
  const [selService, setSelService] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const servs = await getServices();
      setServices(servs);
      setLoading(false);
    };

    loadServices();
  }, []);

  const selectService = async (serv) => {
    const ticket = await getNewTicket(serv);
    setSelService(true);
    setTicketCode(ticket);
  };

  // Split services into pairs for two per row
  const serviceRows = [];
  for (let i = 0; i < services.length; i += 2) {
    serviceRows.push(services.slice(i, i + 2));
  }

  return (
    <>
      <h1 className='text-center mt-4 mb-5'>
        Select the service you need today
      </h1>
      {loading ? (
        <Spinner animation='border' />
      ) : (
        <Container>
          {serviceRows.map((row, index) => (
            <Row key={index} className='mb-3 justify-content-center'>
              {row.map((s, colIndex) => (
                <Col xs={12} md={6} key={colIndex} className='d-grid gap-2'>
                  <Button
                    variant='secondary'
                    size='lg'
                    style={{ padding: "2rem 0", fontSize: "2rem" }}
                    key={s}
                    onClick={() => selectService(s)}
                  >
                    {s}
                  </Button>
                </Col>
              ))}
            </Row>
          ))}
        </Container>
      )}
      {selService && (
        <>
          <Container className='mt-5 mb-5'>
            <Row className='justify-content-center'>
              <Col xs='auto'>
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
          </Container>
          <h3 className='text-center mt-4 mb-4'>
            Thank you, wait for your ticket number to be called
          </h3>
        </>
      )}
    </>
  );
}

export default GetTicket;
