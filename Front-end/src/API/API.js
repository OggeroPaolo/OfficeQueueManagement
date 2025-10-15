const URI = "http://localhost:3000";

// Fetch the list of services from the backend
async function getServices() {
  try {
    const response = await fetch(URI + "/services");
    if (response.ok) {
      const services = await response.json();
      return services;
    } else {
      throw new Error("Failed to fetch services");
    }
  } catch (err) {
    throw new Error("Network error: " + err.message);
  }
}

// Save a new ticket for the given service
async function getNewTicket(serviceTag) {
  const response = await fetch(URI + `/tickets/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ serviceTag: serviceTag }),
  });

  if (response.ok) {
    const ticket = await response.json();
    return ticket.ticket_code;
  } else {
    throw new Error("Failed to create new ticket");
  }
}

// Get the next ticket to serve for the officer at the given counter
async function getNextTicket(counterNumber) {
  const response = await fetch(URI + `/tickets/next`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ counterNumber: counterNumber }),
  });

  if (response.status === 200) {
    const ticket = await response.json();
    return ticket.ticket_code;
  } else if(response.status === 204) {
    return "NO TICKETS ARE WAITING"
  } else {
    throw new Error("Failed to get next ticket");
  }
}

export { getServices, getNewTicket, getNextTicket };
