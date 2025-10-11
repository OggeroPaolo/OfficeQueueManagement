const URI = "http://localhost:3001/api";

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

// TODO
async function saveTicket(serviceId) {
  const response = await fetch(URI + `/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ id: serviceId }),
  });
}
