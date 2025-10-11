import { useState, useEffect } from "react";
import { getServices, saveTicket } from "./API/API.js";
import { Button } from "react-bootstrap";

function GetTicket() {
  const [services, setServices] = useState([]);
  const [selService, setSelService] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      const servs = await getServices();
      setServices(servs);

      loadServices();
    };
  }, []);

  const selectService = async (serviceId) => {
    await saveTicket(serviceId);
    // finish api function so that the code of the ticket can be shown
    setSelService(true);
  };

  return (
    <>
      <h1> Select the service you need today</h1>
      <ul>
        {services.map((s) => (
          <Button key={s.id} onClick={() => selectService(s.id)}>
            {s.name}
          </Button>
        ))}
      </ul>
      {selService && (
        <h3>Thank you, wait for your ticket number to be called</h3>
      )}
    </>
  );
}

export default GetTicket;
