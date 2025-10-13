const URI = "http://localhost:3000";

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


async function getNewTicket(serviceTag) {
  const response = await fetch(URI + `/tickets/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ serviceTag: serviceTag }),
  });
}

async function getNextTicket(counterNumber) {
  const response = await fetch(URI + `/tickets/next`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ counterNumber: counterNumber }),
  });
}

export { getServices, getNewTicket, getNextTicket };
